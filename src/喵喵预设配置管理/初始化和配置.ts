// 定义用于存储配置的世界书的固定名称
export const CONFIG_LOREBOOK_NAME = 'PresetConfigManager_Data';
export const V2_MIGRATION_KEY = 'MiaoMiaoPresetManager_AllConfigs_V2'; // 用于检测旧版合并数据的Key
export const TOGGLE_BUTTON_NAME = '喵喵预设配置管理';
export const UI_ID = 'preset-manager-ui';
export let lastProcessedCharAvatar: string | null = null; // 用于跟踪上一个处理过的角色，防止重复触发

// 小贴士列表
export const TIPS = [
  '如果你玩BL的话，来试试小n同人女预设吧！其他MoM系预设也可以试试哦！',
  '当你的总token达到6w左右时，你就该总结隐藏了哦',
  '你知道吗，聊天界面开关正则有一定可能丢失你的聊天记录',
  '不要使用第三方/"半公益站"的api或云酒馆！首先你的数据会非常不安全，其次没有后台我们无法解答你的问题，最后贩子不仅收你钱还掺水！',
];

export function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// 生成标准的UUID v4格式，用作预设条目 identifier
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function setLastProcessedCharAvatar(avatar: string | null): void {
  lastProcessedCharAvatar = avatar;
}

// 确保配置世界书存在
export async function ensureConfigLorebookExists(): Promise<void> {
  try {
    await TavernHelper.getWorldbook(CONFIG_LOREBOOK_NAME);
  } catch (error) {
    console.log(`'${CONFIG_LOREBOOK_NAME}' not found. Creating it now.`);
    await TavernHelper.createOrReplaceWorldbook(CONFIG_LOREBOOK_NAME, []);
  }
}

// 初始化函数（将在加载时执行函数中调用）
export async function initializePresetManager(): Promise<void> {
  await ensureConfigLorebookExists();

  $(document).on('click', function (e) {
    if (!$(e.target).is('button[name="more-actions"]') && $(e.target).closest('.pm-submenu').length === 0) {
      $('.pm-submenu').hide();
    }
  });

  // 自动为所有预设创建识别条目（仅在新版用户首次使用时执行）
  try {
    const configs = await import('./配置操作功能').then(m => m.getStoredConfigs());
    const hasOldConfigs = Object.values(configs).some((config: any) => !config.identifierId && config.presetName);

    if (hasOldConfigs) {
      console.log('检测到旧版配置，开始自动创建识别条目...');
      const { autoCreateIdentifiersForAllPresets } = await import('./配置操作功能');
      await autoCreateIdentifiersForAllPresets();
    }
  } catch (error) {
    console.error('自动创建识别条目时出错:', error);
  }
}

// 移除自动初始化，改为在加载时执行函数中调用
