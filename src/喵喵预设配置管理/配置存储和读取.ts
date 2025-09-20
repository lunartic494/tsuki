import { CONFIG_LOREBOOK_NAME, V2_MIGRATION_KEY } from './初始化和配置';

export interface ConfigData {
  id: string;
  name: string;
  presetName?: string;
  states: Array<{ id: string; enabled: boolean; name: string }>;
  regexStates?: Array<{ id: string; enabled: boolean }>;
  boundCharAvatar?: string;
  boundCharName?: string;
}

// 添加配置缓存
let configCache: Record<string, ConfigData> | null = null;
let lastCacheTime = 0;
const CONFIG_CACHE_DURATION = 10000; // 10秒缓存

export async function getStoredConfigs(): Promise<Record<string, ConfigData>> {
  // 检查缓存是否有效
  const now = Date.now();
  if (configCache && now - lastCacheTime < CONFIG_CACHE_DURATION) {
    return configCache;
  }

  let worldbookEntries;
  try {
    worldbookEntries = await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
  } catch (error) {
    return {};
  }

  const v2Entry = worldbookEntries.find((entry: any) => entry.strategy?.keys?.includes(V2_MIGRATION_KEY));
  if (v2Entry) {
    console.log('喵喵预设配置管理: 检测到旧版合并数据，正在迁移...');
    try {
      const configsArray = JSON.parse(v2Entry.content);
      const migratedEntries = configsArray.map((config: any) => ({
        name: config.name || config.id,
        strategy: { type: 'constant', keys: [config.id] },
        content: JSON.stringify(config),
        enabled: false,
      }));

      const otherEntries = worldbookEntries.filter((entry: any) => !entry.strategy?.keys?.includes(V2_MIGRATION_KEY));
      await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, [...otherEntries, ...migratedEntries]);
      toastr.info('喵喵预设配置管理：已自动升级数据格式。');
      worldbookEntries = await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
    } catch (e) {
      console.error('迁移配置失败:', e);
      toastr.error('自动迁移配置数据失败，请检查控制台。');
    }
  }

  const configs: Record<string, ConfigData> = {};
  for (const entry of worldbookEntries) {
    try {
      const configData = JSON.parse(entry.content);
      if (configData.id && configData.name && Array.isArray(configData.states)) {
        configs[configData.id] = configData;
      }
    } catch (e) {
      // 忽略解析失败的条目
    }
  }

  // 更新缓存
  configCache = configs;
  lastCacheTime = now;

  return configs;
}

// 清除配置缓存
export function clearConfigCache(): void {
  configCache = null;
  lastCacheTime = 0;
}

export async function setStoredConfigs(configsObject: Record<string, ConfigData>): Promise<void> {
  try {
    const nameCounts: Record<string, number> = {};
    const entries = Object.values(configsObject).map(config => {
      let entryName = config.name;
      nameCounts[entryName] = (nameCounts[entryName] || 0) + 1;
      if (nameCounts[entryName] > 1) {
        entryName = `${entryName} (${config.id.slice(-5)})`;
      }
      return {
        name: entryName,
        strategy: { type: 'constant', keys: [config.id] },
        content: JSON.stringify(config),
        enabled: false,
        comment: `MiaoMiao Preset Config: ${config.name} (ID: ${config.id})`,
      };
    });
    await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, entries);
  } catch (error) {
    console.error('写入配置到世界书失败:', error);
    toastr.error('配置保存/更新失败，请检查控制台日志。');
  }
}

export async function renderConfigsList(): Promise<void> {
  const configsObject = await getStoredConfigs();
  const configs = Object.values(configsObject);
  const listElement = $('#preset-manager-list');
  listElement.empty();

  if (configs.length === 0) {
    listElement.append('<li style="color:#888; padding:10px;">暂无已保存的配置。</li>');
    return;
  }

  const groupedConfigs = configs.reduce((acc: Record<string, ConfigData[]>, config) => {
    const groupName = config.presetName || '未分类';
    if (!acc[groupName]) acc[groupName] = [];
    acc[groupName].push(config);
    return acc;
  }, {});

  const sortedGroupNames = Object.keys(groupedConfigs).sort((a, b) => {
    if (a === '未分类') return 1;
    if (b === '未分类') return -1;
    return a.localeCompare(b);
  });

  for (const groupName of sortedGroupNames) {
    const configsInGroup = groupedConfigs[groupName];
    const safeGroupName = $('<div/>').text(groupName).html();
    const isUncategorized = groupName === '未分类';

    const groupElement = $(`
            <details class="pm-config-group" ${isUncategorized ? 'open' : ''}>
                <summary class="pm-config-group-summary">${safeGroupName} <span class="pm-config-count">(${configsInGroup.length})</span></summary>
                <ul class="pm-config-sublist"></ul>
            </details>
        `);
    const sublist = groupElement.find('.pm-config-sublist');

    for (const configData of configsInGroup) {
      const boundCharDisplay = configData.boundCharName
        ? `<span style="color:#4CAF50; margin-left: 8px; font-weight:bold;">(绑定: ${configData.boundCharName})</span>`
        : '';

      const listItem = $(`
                <li style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom: 1px solid #f0e2d0; font-size:14px;">
                    <div style="display:flex; flex-direction:column; align-items:flex-start; overflow:hidden; margin-right: 10px; flex: 1; min-width: 0;">
                        <span style="font-weight:bold; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; max-width: 100%;" title="${$('<div/>').text(configData.name).html()}">${$('<div/>').text(configData.name).html()}${boundCharDisplay}</span>
                    </div>
                    <div class="pm-actions-container">
                        <button data-id="${configData.id}" name="load-config" style="background-color:#f9d6a5; color:#3a2c2c;">加载</button>
                        <button data-id="${configData.id}" name="delete-config" style="background-color:#f5a8a0; color:#fff;">删除</button>
                        <div class="pm-more-btn-wrapper">
                            <button name="more-actions" style="background-color:#b0bec5; color:#fff;">更多</button>
                            <div class="pm-submenu">
                                <button data-id="${configData.id}" name="view-config">查看</button>
                                <button data-id="${configData.id}" name="update-config">更新</button>
                                <button data-id="${configData.id}" name="rename-config">重命名</button>
                                <button data-id="${configData.id}" name="bind-regex">正则</button>
                                <button data-id="${configData.id}" name="export-config">导出</button>
                                <div style="border-top: 1px solid #eee; margin: 5px 0;"></div>
                                <button name="close-submenu" style="color: #888; text-align: center;">关闭</button>
                            </div>
                        </div>
                    </div>
                </li>
            `);
      sublist.append(listItem);
    }
    listElement.append(groupElement);
  }

  // 绑定按钮事件
  // 使用动态导入避免循环引用
  import('./事件绑定').then(({ bindConfigListEvents }) => {
    bindConfigListEvents();
  });
}
