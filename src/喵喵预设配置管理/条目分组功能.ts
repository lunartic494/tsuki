export interface PromptGroup {
  id: string;
  name: string;
  promptIds: string[];
  collapsed: boolean;
}

// 分组数据存储键名（基于预设名称）
function getGroupingStorageKey(presetName: string): string {
  return `miaomiao_preset_groups_${presetName}`;
}

// 获取预设的分组配置
function getPresetGrouping(presetName: string): PromptGroup[] {
  try {
    const stored = localStorage.getItem(getGroupingStorageKey(presetName));
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('获取分组配置失败:', error);
    return [];
  }
}

// 保存预设的分组配置
function savePresetGrouping(presetName: string, groups: PromptGroup[]): void {
  try {
    localStorage.setItem(getGroupingStorageKey(presetName), JSON.stringify(groups));
  } catch (error) {
    console.error('保存分组配置失败:', error);
  }
}

// 获取当前预设的所有条目
export function getCurrentPresetPrompts(): Array<{ id: string; name: string; element: JQuery; enabled: boolean }> {
  const prompts: Array<{ id: string; name: string; element: JQuery; enabled: boolean }> = [];
  const promptElements = $('.completion_prompt_manager_prompt');

  promptElements.each(function () {
    const element = $(this);
    const id = element.data('pm-identifier') || element.find('[data-pm-identifier]').data('pm-identifier');

    if (!id) return; // 早期跳出，避免不必要的DOM查询

    const nameElement = element.find('.completion_prompt_manager_prompt_name');
    const name = nameElement.find('a').text().trim() || nameElement.text().trim();

    if (!name) return; // 早期跳出

    const isEnabled = element.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');

    prompts.push({
      id: id,
      name: name,
      element: element,
      enabled: isEnabled,
    });
  });

  return prompts;
}

// 显示条目分组界面
export async function showPromptGroupingUI(): Promise<void> {
  const popupId = 'preset-manager-grouping-popup';
  $(`#${popupId}`).remove();

  const prompts = getCurrentPresetPrompts();
  if (prompts.length === 0) {
    toastr.warning('当前预设没有可分组的条目。');
    return;
  }

  // 获取当前预设的分组信息
  const currentPresetName = TavernHelper.getLoadedPresetName();
  const existingGroups = getPresetGrouping(currentPresetName);

  const promptsHtml = prompts
    .map((prompt, index) => {
      const isInGroup = existingGroups.some(group => group.promptIds.includes(prompt.id));
      const groupName = existingGroups.find(group => group.promptIds.includes(prompt.id))?.name || '';

      return `
      <div class="prompt-item" data-prompt-id="${prompt.id}" data-index="${index}" 
           style="display: flex; align-items: center; padding: 8px; border: 1px solid #e0e0e0; margin: 2px 0; border-radius: 4px; cursor: pointer; background-color: ${isInGroup ? '#e8f5e8' : '#fff'};">
        <input type="checkbox" class="prompt-checkbox" style="margin-right: 10px; transform: scale(1.2);">
        <span style="flex: 1; font-weight: ${prompt.enabled ? 'bold' : 'normal'}; color: ${prompt.enabled ? '#000' : '#666'};">
          ${$('<div/>').text(prompt.name).html()}
        </span>
        ${isInGroup ? `<span style="font-size: 12px; color: #4CAF50; background: #e8f5e8; padding: 2px 6px; border-radius: 3px;">${groupName}</span>` : ''}
      </div>
    `;
    })
    .join('');

  const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">预设条目分组管理</h4>
        
        <div style="margin: 15px 0; display: flex; gap: 10px; align-items: center;">
          <input type="text" id="group-name-input" placeholder="输入分组名称..." style="flex: 1; padding: 6px 10px; border: 1px solid #d4b58b; border-radius: 4px; background: #fff; color: #333;">
          <button id="create-group-btn" style="padding: 6px 12px; background-color:#4CAF50; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">创建分组</button>
          <button id="remove-group-btn" style="padding: 6px 12px; background-color:#f44336; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">移除分组</button>
          <button id="clear-all-groups-btn" style="padding: 6px 12px; background-color:#ff5722; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">清除所有</button>
        </div>

        <div style="margin-bottom: 15px; display: flex; gap: 10px;">
          <button id="select-all-btn" style="padding: 4px 8px; background-color:#2196F3; border:none; border-radius:4px; color:#fff; cursor:pointer; font-size:12px;">全选</button>
          <button id="select-none-btn" style="padding: 4px 8px; background-color:#9E9E9E; border:none; border-radius:4px; color:#fff; cursor:pointer; font-size:12px;">全不选</button>
        </div>

        <div style="flex: 1; min-height: 0; overflow-y: auto; border: 1px solid #f0e2d0; border-radius: 8px; padding: 10px; margin-bottom: 15px;">
          <div style="font-size: 14px; color: #666; margin-bottom: 10px;">提示：选中条目后可以创建分组，分组后的条目会在预设界面中折叠显示</div>
          <div id="prompts-container">
            ${promptsHtml}
          </div>
        </div>

        <div style="margin-bottom: 15px; padding: 10px; background-color: #f0f8ff; border-radius: 6px; border-left: 4px solid #2196F3;">
          <div style="font-size: 13px; color: #1976D2; font-weight: bold; margin-bottom: 5px;">💡 分组说明</div>
          <div style="font-size: 12px; color: #424242;">分组设置直接应用到预设界面，会自动保存到浏览器本地存储中，与预设绑定。</div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div id="existing-groups-info" style="font-size: 12px; color: #666;"></div>
          <div style="display: flex; gap: 10px;">
            <button id="grouping-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
          </div>
        </div>
      </div>
    </div>
  `;

  $('body').append(popupHtml);

  // 显示现有分组信息
  updateExistingGroupsInfo(existingGroups);

  // 绑定事件
  bindGroupingEvents(prompts, existingGroups);

  // 移动端样式
  const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 90vh !important; } }</style>`;
  $(`#${popupId}`).append(mobileStyles);
}

function updateExistingGroupsInfo(groups: PromptGroup[]): void {
  const infoElement = $('#existing-groups-info');
  if (groups.length === 0) {
    infoElement.text('当前没有分组');
  } else {
    infoElement.text(`现有分组: ${groups.map(g => g.name).join(', ')}`);
  }
}

function bindGroupingEvents(
  _prompts: Array<{ id: string; name: string; element: JQuery; enabled: boolean }>,
  existingGroups: PromptGroup[],
): void {
  let selectedPrompts: string[] = [];

  // 条目选择
  $('.prompt-item').on('click', function (e) {
    if ((e.target as HTMLInputElement).type === 'checkbox') return;

    const checkbox = $(this).find('.prompt-checkbox');
    checkbox.prop('checked', !checkbox.prop('checked'));
    updateSelectedPrompts();
  });

  $('.prompt-checkbox').on('change', updateSelectedPrompts);

  function updateSelectedPrompts(): void {
    selectedPrompts = [];
    $('.prompt-checkbox:checked').each(function () {
      const promptId = $(this).closest('.prompt-item').data('prompt-id');
      selectedPrompts.push(promptId);
    });
  }

  // 全选/全不选
  $('#select-all-btn').on('click', () => {
    $('.prompt-checkbox').prop('checked', true);
    updateSelectedPrompts();
  });

  $('#select-none-btn').on('click', () => {
    $('.prompt-checkbox').prop('checked', false);
    updateSelectedPrompts();
  });

  // 创建分组
  $('#create-group-btn').on('click', async () => {
    const groupName = $('#group-name-input').val()?.toString().trim();
    if (!groupName) {
      toastr.error('请输入分组名称');
      return;
    }

    if (selectedPrompts.length === 0) {
      toastr.error('请选择要分组的条目');
      return;
    }

    // 检查是否有重名分组
    if (existingGroups.some(g => g.name === groupName)) {
      toastr.error('分组名称已存在');
      return;
    }

    // 检查选中的条目是否已经在其他分组中
    const alreadyGroupedPrompts: string[] = [];
    selectedPrompts.forEach(promptId => {
      const existingGroup = existingGroups.find(group => group.promptIds.includes(promptId));
      if (existingGroup) {
        alreadyGroupedPrompts.push(promptId);
      }
    });

    if (alreadyGroupedPrompts.length > 0) {
      // 获取已分组条目的名称
      const alreadyGroupedNames = alreadyGroupedPrompts.map(promptId => {
        const promptItem = $(`.prompt-item[data-prompt-id="${promptId}"]`);
        return promptItem.find('span:first').text().trim();
      });

      toastr.error(
        `以下条目已在其他分组中，无法重复分组：${alreadyGroupedNames.slice(0, 3).join('、')}${alreadyGroupedNames.length > 3 ? '等' : ''}`,
      );
      return;
    }

    // 创建新分组
    const newGroup: PromptGroup = {
      id: Date.now().toString(),
      name: groupName,
      promptIds: [...selectedPrompts],
      collapsed: true,
    };

    existingGroups.push(newGroup);

    // 更新UI
    selectedPrompts.forEach(promptId => {
      const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
      item.css('background-color', '#e8f5e8');
      const existingTag = item.find('.group-tag');
      if (existingTag.length) {
        existingTag.text(groupName);
      } else {
        item
          .find('span:last')
          .after(
            `<span class="group-tag" style="font-size: 12px; color: #4CAF50; background: #e8f5e8; padding: 2px 6px; border-radius: 3px; margin-left: 8px;">${groupName}</span>`,
          );
      }
    });

    updateExistingGroupsInfo(existingGroups);
    $('#group-name-input').val('');
    $('.prompt-checkbox').prop('checked', false);
    selectedPrompts = [];

    // 直接应用分组到预设界面
    applyGroupingToPreset(existingGroups);

    toastr.success(`分组 "${groupName}" 创建成功并已应用`);
  });

  // 移除分组
  $('#remove-group-btn').on('click', () => {
    if (selectedPrompts.length === 0) {
      toastr.error('请选择要移除分组的条目');
      return;
    }

    // 从所有分组中移除选中的条目
    existingGroups.forEach(group => {
      group.promptIds = group.promptIds.filter(id => !selectedPrompts.includes(id));
    });

    // 移除空分组
    const groupsToRemove = existingGroups.filter(group => group.promptIds.length === 0);
    groupsToRemove.forEach(group => {
      const index = existingGroups.indexOf(group);
      if (index > -1) existingGroups.splice(index, 1);
    });

    // 更新UI
    selectedPrompts.forEach(promptId => {
      const item = $(`.prompt-item[data-prompt-id="${promptId}"]`);
      item.css('background-color', '#fff');
      item.find('.group-tag').remove();
    });

    updateExistingGroupsInfo(existingGroups);
    $('.prompt-checkbox').prop('checked', false);
    selectedPrompts = [];

    // 直接应用分组到预设界面
    applyGroupingToPreset(existingGroups);

    toastr.success('已移除选中条目的分组并应用');
  });

  // 清除所有分组
  $('#clear-all-groups-btn').on('click', async () => {
    if (existingGroups.length === 0) {
      toastr.info('当前没有分组需要清除');
      return;
    }

    const confirmChoice = await triggerSlash(
      `/popup okButton="确认清除" cancelButton="取消" result=true "确定要清除当前预设的所有分组吗？此操作不可撤销。"`,
    );
    if (confirmChoice === '1') {
      // 清空分组数组
      existingGroups.length = 0;

      // 更新UI显示
      $('.prompt-item').each(function () {
        $(this).css('background-color', '#fff');
        $(this).find('.group-tag').remove();
      });

      updateExistingGroupsInfo(existingGroups);
      $('.prompt-checkbox').prop('checked', false);
      selectedPrompts = [];

      // 直接应用清空的分组到预设界面
      applyGroupingToPreset(existingGroups);

      toastr.success('已清除所有分组并应用');
    }
  });

  // 关闭
  $('#grouping-close').on('click', () => {
    // 关闭前确保保存当前的分组状态
    const currentPresetName = TavernHelper.getLoadedPresetName();
    const validGroups = existingGroups.filter(g => g.promptIds.length > 0);
    savePresetGrouping(currentPresetName, validGroups);

    // 确保分组应用到预设界面
    applyGroupingToDOM(validGroups);

    $('#preset-manager-grouping-popup').remove();
    console.log('分组界面关闭，已保存并应用分组配置');
  });
}

// 应用分组到预设界面
function applyGroupingToPreset(groups: PromptGroup[]): void {
  try {
    // 保存分组配置到本地存储
    const currentPresetName = TavernHelper.getLoadedPresetName();
    const validGroups = groups.filter(g => g.promptIds.length > 0);
    savePresetGrouping(currentPresetName, validGroups);

    // 应用DOM分组效果
    applyGroupingToDOM(validGroups);

    toastr.success('分组设置已应用到预设界面');
  } catch (error) {
    console.error('应用分组失败:', error);
    toastr.error('应用分组失败，请检查控制台');
  }
}

// 应用分组到DOM
function applyGroupingToDOM(groups: PromptGroup[]): void {
  console.log('开始应用分组到DOM，分组数量:', groups.length);

  // 移除现有的分组容器
  $('.prompt-group-container').remove();

  // 确保所有条目都从分组容器中移出
  $('.prompt-group-container .completion_prompt_manager_prompt').each(function () {
    $(this).insertAfter($('.completion_prompt_manager_prompt').last());
  });

  groups.forEach(group => {
    if (group.promptIds.length === 0) return;

    console.log('处理分组:', group.name, '条目数量:', group.promptIds.length);

    // 找到分组中的第一个条目
    const firstPromptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${group.promptIds[0]}"]`);
    if (firstPromptElement.length === 0) {
      console.log('未找到分组第一个条目:', group.promptIds[0]);
      return;
    }

    console.log('找到第一个条目，开始创建分组容器');

    // 统计分组内启用的条目数量
    const enabledCount = group.promptIds.filter(promptId => {
      const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
      return promptElement.find('.prompt-manager-toggle-action').hasClass('fa-toggle-on');
    }).length;

    // 创建分组容器
    const groupContainer = $(`
      <div class="prompt-group-container" style="border: 1px solid rgba(128, 128, 128, 0.3); margin: 5px 0; background-color: rgba(0, 0, 0, 0.05);">
        <div class="prompt-group-header" style="padding: 6px 10px; background-color: rgba(0, 0, 0, 0.08); cursor: pointer; display: flex; align-items: center;">
          <span class="group-toggle-icon" style="margin-right: 6px; font-size: 12px; color: inherit;">${group.collapsed ? '▶' : '▼'}</span>
          <span style="font-weight: bold; color: inherit;">${$('<div/>').text(group.name).html()}</span>
          <span style="margin-left: 8px; font-size: 12px; color: #666;">(${enabledCount}/${group.promptIds.length})</span>
        </div>
        <div class="prompt-group-content" style="padding: 3px; ${group.collapsed ? 'display: none;' : ''}"></div>
      </div>
    `);

    // 将分组插入到第一个条目之前
    firstPromptElement.before(groupContainer);
    console.log('分组容器已插入到DOM');

    // 将分组中的所有条目移动到分组容器中
    group.promptIds.forEach(promptId => {
      const promptElement = $(`.completion_prompt_manager_prompt[data-pm-identifier="${promptId}"]`);
      if (promptElement.length > 0) {
        groupContainer.find('.prompt-group-content').append(promptElement);
        console.log('移动条目到分组容器:', promptId);
      } else {
        console.log('未找到条目:', promptId);
      }
    });

    console.log('分组容器创建完成，条目数量:', groupContainer.find('.completion_prompt_manager_prompt').length);

    // 绑定展开/折叠事件
    groupContainer.find('.prompt-group-header').on('click', function () {
      const content = $(this).siblings('.prompt-group-content');
      const icon = $(this).find('.group-toggle-icon');

      if (content.is(':visible')) {
        content.hide();
        icon.text('▶');
        group.collapsed = true;
      } else {
        content.show();
        icon.text('▼');
        group.collapsed = false;
      }
    });
  });
}

// 加载时恢复分组
export function restoreGroupingFromConfig(): void {
  try {
    const currentPresetName = TavernHelper.getLoadedPresetName();
    const groups = getPresetGrouping(currentPresetName);

    if (groups.length > 0) {
      console.log(`恢复预设 "${currentPresetName}" 的分组配置，共 ${groups.length} 个分组`);
      // 延迟一点时间确保DOM已加载
      setTimeout(() => {
        applyGroupingToDOM(groups);
      }, 200);
    } else {
      console.log(`预设 "${currentPresetName}" 没有分组配置`);
    }
  } catch (error) {
    console.error('恢复分组配置失败:', error);
  }
}

// 延迟恢复分组（用于DOM变化后）
export function restoreGroupingDelayed(delay: number = 500): void {
  setTimeout(() => {
    restoreGroupingFromConfig();
  }, delay);
}

// 强制恢复分组（多次尝试确保成功）
export function forceRestoreGrouping(): void {
  const tryRestore = (attempt: number) => {
    const currentPresetName = TavernHelper.getLoadedPresetName();
    const groups = getPresetGrouping(currentPresetName);
    const promptElements = $('.completion_prompt_manager_prompt');

    console.log(
      `第${attempt}次尝试恢复分组，预设: ${currentPresetName}, 分组数: ${groups.length}, 条目数: ${promptElements.length}`,
    );

    if (groups.length > 0 && promptElements.length > 0) {
      applyGroupingToDOM(groups);
      console.log('✅ 分组恢复成功');
    } else if (attempt < 5) {
      // 如果还没有条目或分组，继续尝试
      setTimeout(() => tryRestore(attempt + 1), 500);
    } else {
      console.log('⚠️ 分组恢复失败，已达到最大尝试次数');
    }
  };

  tryRestore(1);
}

// 清除所有分组
export function clearAllGrouping(): void {
  $('.prompt-group-container').each(function () {
    const prompts = $(this).find('.completion_prompt_manager_prompt');
    $(this).before(prompts);
    $(this).remove();
  });
}

// 导出当前预设的分组配置
export function exportPresetGrouping(presetName: string): PromptGroup[] | null {
  const groups = getPresetGrouping(presetName);
  return groups.length > 0 ? groups : null;
}

// 导入分组配置到指定预设
export function importPresetGrouping(presetName: string, groups: PromptGroup[]): void {
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    console.warn('导入的分组配置为空或格式不正确');
    return;
  }

  console.log('开始导入分组配置到预设:', presetName, '分组数量:', groups.length);

  // 验证并修复分组数据结构
  const validGroups = groups
    .map(group => {
      // 确保分组对象有所有必需的字段
      const validGroup: PromptGroup = {
        id: group.id || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: group.name || '未命名分组',
        promptIds: Array.isArray(group.promptIds) ? group.promptIds : [],
        collapsed: typeof group.collapsed === 'boolean' ? group.collapsed : true,
      };

      console.log('处理分组:', validGroup.name, '条目数量:', validGroup.promptIds.length);
      return validGroup;
    })
    .filter(group => group.promptIds.length > 0); // 只保留有条目的分组

  if (validGroups.length === 0) {
    console.warn('没有有效的分组配置');
    return;
  }

  console.log('有效分组数量:', validGroups.length);
  savePresetGrouping(presetName, validGroups);

  // 如果是当前预设，立即应用
  const currentPresetName = TavernHelper.getLoadedPresetName();
  console.log('当前预设:', currentPresetName, '目标预设:', presetName);
  if (currentPresetName === presetName) {
    console.log('立即应用分组到当前预设');
    setTimeout(() => {
      applyGroupingToDOM(validGroups);
    }, 100);
  }
}

// 获取所有预设的分组配置（用于批量导出）
export function getAllPresetGroupings(): Record<string, PromptGroup[]> {
  const allGroupings: Record<string, PromptGroup[]> = {};

  // 遍历localStorage中所有的分组配置
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith('miaomiao_preset_groups_')) {
      const presetName = key.replace('miaomiao_preset_groups_', '');
      const groups = getPresetGrouping(presetName);
      if (groups.length > 0) {
        allGroupings[presetName] = groups;
      }
    }
  }

  return allGroupings;
}

// 清除指定预设的分组配置
export function clearPresetGrouping(presetName: string): void {
  localStorage.removeItem(getGroupingStorageKey(presetName));

  // 如果是当前预设，清除DOM中的分组
  const currentPresetName = TavernHelper.getLoadedPresetName();
  if (currentPresetName === presetName) {
    clearAllGrouping();
  }
}
