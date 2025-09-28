import { generateUniqueId } from './初始化和配置';
import { triggerGroupingRestore } from './条目分组功能';
import { toggleUI, updateConfigListCache } from './界面创建和管理';
import { showNewEntriesPopup } from './辅助弹窗功能';
import {
  clearConfigCache,
  ConfigData,
  getPresetNameByIdentifier,
  getStoredConfigs,
  renderConfigsList,
  setStoredConfigs,
} from './配置存储和读取';

// 特殊识别条目的名称和内容
const IDENTIFIER_PROMPT_NAME = '*喵喵脚本识别*';
const IDENTIFIER_PROMPT_CONTENT = '';

// 触发一次预设保存，避免条目更改丢失
function triggerPresetSave(): void {
  try {
    const $btn = $('#update_oai_preset');
    if ($btn.length) {
      $btn.trigger('click');
      console.log('已触发预设保存');
    } else {
      console.warn('未找到预设保存按钮 #update_oai_preset');
    }
  } catch (err) {
    console.error('触发预设保存时出错:', err);
  }
}

// 创建或获取识别条目
async function createOrGetIdentifierPrompt(): Promise<string | null> {
  try {
    // 获取当前预设的所有条目
    const preset = TavernHelper.getPreset('in_use');
    const prompts = [...preset.prompts, ...preset.prompts_unused];

    // 查找是否已存在识别条目
    const existingPrompt = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);
    if (existingPrompt) {
      console.log('找到现有识别条目:', existingPrompt.id);
      return existingPrompt.id;
    }

    // 创建新的识别条目
    console.log('创建新的识别条目...');
    await TavernHelper.updatePresetWith(
      'in_use',
      preset => {
        const newPrompt: PresetPrompt = {
          id: generateUniqueId(),
          name: IDENTIFIER_PROMPT_NAME,
          enabled: false, // 不启用
          position: {
            type: 'relative',
          },
          role: 'system',
          content: IDENTIFIER_PROMPT_CONTENT,
        };

        // 添加到预设的prompts数组末尾
        preset.prompts.push(newPrompt);
        return preset;
      },
      { render: 'immediate' },
    );

    // 触发保存
    triggerPresetSave();

    // 重新获取条目列表以获取新创建的ID
    const updatedPreset = TavernHelper.getPreset('in_use');
    const updatedPrompts = [...updatedPreset.prompts, ...updatedPreset.prompts_unused];
    const newPrompt = updatedPrompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);

    if (newPrompt) {
      console.log('识别条目创建成功，ID:', newPrompt.id);
      return newPrompt.id;
    } else {
      console.error('无法找到新创建的识别条目');
      return null;
    }
  } catch (error) {
    console.error('创建识别条目失败:', error);
    return null;
  }
}

// 确保当前预设中有指定的识别条目
async function ensureIdentifierInCurrentPreset(identifierId: string): Promise<void> {
  try {
    const preset = TavernHelper.getPreset('in_use');
    const prompts = [...preset.prompts, ...preset.prompts_unused];

    // 检查是否已存在该识别条目
    const existingPrompt = prompts.find(p => p.id === identifierId);
    if (existingPrompt) {
      console.log('当前预设中已存在识别条目:', identifierId);
      return;
    }

    // 如果不存在，创建该识别条目
    console.log('在当前预设中创建识别条目:', identifierId);
    await TavernHelper.updatePresetWith(
      'in_use',
      preset => {
        const newPrompt: PresetPrompt = {
          id: identifierId,
          name: IDENTIFIER_PROMPT_NAME,
          enabled: false, // 不启用
          position: {
            type: 'relative',
          },
          role: 'system',
          content: IDENTIFIER_PROMPT_CONTENT,
        };

        // 添加到预设的prompts数组末尾
        preset.prompts.push(newPrompt);
        return preset;
      },
      { render: 'immediate' },
    );

    // 触发保存
    triggerPresetSave();
    console.log('识别条目已添加到当前预设');
  } catch (error) {
    console.error('确保识别条目存在失败:', error);
  }
}

// 为指定预设创建识别条目
async function createIdentifierForPreset(presetName: string): Promise<string | null> {
  try {
    // 切换到目标预设
    if (!TavernHelper.loadPreset(presetName)) {
      console.warn(`无法加载预设: ${presetName}`);
      return null;
    }

    // 等待预设切换完成
    await new Promise(resolve => setTimeout(resolve, 500));

    // 检查预设是否已有识别条目
    const preset = TavernHelper.getPreset('in_use');
    const prompts = [...preset.prompts, ...preset.prompts_unused];
    const existingIdentifier = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);

    if (existingIdentifier) {
      console.log(`预设 "${presetName}" 已存在识别条目:`, existingIdentifier.id);
      return existingIdentifier.id;
    }

    // 创建新的识别条目
    const identifierId = generateUniqueId();
    console.log(`为预设 "${presetName}" 创建识别条目，ID:`, identifierId);

    await TavernHelper.updatePresetWith(
      'in_use',
      preset => {
        const newPrompt: PresetPrompt = {
          id: identifierId,
          name: IDENTIFIER_PROMPT_NAME,
          enabled: false, // 不启用
          position: {
            type: 'relative',
          },
          role: 'system',
          content: IDENTIFIER_PROMPT_CONTENT,
        };

        // 添加到预设的prompts数组末尾
        preset.prompts.push(newPrompt);
        return preset;
      },
      { render: 'immediate' },
    );

    // 触发保存
    triggerPresetSave();
    console.log(`预设 "${presetName}" 识别条目创建完成，ID:`, identifierId);
    return identifierId;
  } catch (error) {
    console.error(`为预设 "${presetName}" 创建识别条目失败:`, error);
    return null;
  }
}

// 为当前预设创建识别条目并更新所有相关配置
export async function createIdentifierForCurrentPreset(): Promise<void> {
  try {
    // 检查当前预设是否已有识别条目
    const preset = TavernHelper.getPreset('in_use');
    const prompts = [...preset.prompts, ...preset.prompts_unused];
    const existingIdentifier = prompts.find(p => p.name === IDENTIFIER_PROMPT_NAME);

    if (existingIdentifier) {
      toastr.warning('当前预设已存在识别条目，无需重复创建');
      return;
    }

    // 创建新的识别条目
    const identifierId = generateUniqueId();
    console.log('为当前预设创建识别条目，ID:', identifierId);

    await TavernHelper.updatePresetWith(
      'in_use',
      preset => {
        const newPrompt: PresetPrompt = {
          id: identifierId,
          name: IDENTIFIER_PROMPT_NAME,
          enabled: false, // 不启用
          position: {
            type: 'relative',
          },
          role: 'system',
          content: IDENTIFIER_PROMPT_CONTENT,
        };

        // 添加到预设的prompts数组末尾
        preset.prompts.push(newPrompt);
        return preset;
      },
      { render: 'immediate' },
    );

    // 触发保存
    triggerPresetSave();

    // 获取当前预设名称
    const currentPresetName = TavernHelper.getLoadedPresetName();
    console.log('当前预设名称:', currentPresetName);

    // 更新所有使用当前预设名称的旧配置，添加识别条目ID
    const configs = await getStoredConfigs();
    let updatedCount = 0;

    for (const configId in configs) {
      const config = configs[configId];
      // 如果配置没有identifierId且presetName匹配当前预设
      if (!config.identifierId && config.presetName === currentPresetName) {
        config.identifierId = identifierId;
        updatedCount++;
        console.log(`更新配置 "${config.name}" 添加识别条目ID`);
      }
    }

    if (updatedCount > 0) {
      // 保存更新后的配置
      await setStoredConfigs(configs);

      // 清除缓存并重新渲染
      clearConfigCache();
      await renderConfigsList();

      toastr.success(`已为当前预设创建识别条目，并更新了 ${updatedCount} 个相关配置`);
    } else {
      toastr.success('已为当前预设创建识别条目');
    }

    console.log('识别条目创建完成，ID:', identifierId);
  } catch (error) {
    console.error('创建识别条目失败:', error);
    toastr.error('创建识别条目失败，请检查控制台日志');
  }
}

// 自动为所有预设创建识别条目并更新配置
export async function autoCreateIdentifiersForAllPresets(): Promise<void> {
  try {
    console.log('开始自动为所有预设创建识别条目...');

    // 获取所有预设名称
    const presetNames = TavernHelper.getPresetNames();
    console.log('找到预设列表:', presetNames);

    // 获取所有配置
    const configs = await getStoredConfigs();
    console.log('找到配置数量:', Object.keys(configs).length);

    // 统计需要处理的预设
    const presetToProcess = new Set<string>();
    for (const configId in configs) {
      const config = configs[configId];
      if (!config.identifierId && config.presetName) {
        presetToProcess.add(config.presetName);
      }
    }

    console.log('需要处理的预设:', Array.from(presetToProcess));

    if (presetToProcess.size === 0) {
      console.log('所有配置都已有关联的识别条目，无需处理');
      return;
    }

    // 记录当前预设，稍后恢复
    const originalPreset = TavernHelper.getLoadedPresetName();
    console.log('当前预设:', originalPreset);

    let totalUpdated = 0;
    const presetIdentifierMap = new Map<string, string>();

    // 为每个需要处理的预设创建识别条目
    for (const presetName of presetToProcess) {
      if (presetNames.includes(presetName)) {
        console.log(`处理预设: ${presetName}`);
        const identifierId = await createIdentifierForPreset(presetName);
        if (identifierId) {
          presetIdentifierMap.set(presetName, identifierId);
          console.log(`预设 "${presetName}" 识别条目ID: ${identifierId}`);
        }
      } else {
        console.warn(`预设 "${presetName}" 不存在，跳过`);
      }
    }

    // 更新所有相关配置
    for (const configId in configs) {
      const config = configs[configId];
      if (!config.identifierId && config.presetName && presetIdentifierMap.has(config.presetName)) {
        config.identifierId = presetIdentifierMap.get(config.presetName);
        totalUpdated++;
        console.log(`更新配置 "${config.name}" 关联预设 "${config.presetName}"`);
      }
    }

    // 保存更新后的配置
    if (totalUpdated > 0) {
      await setStoredConfigs(configs);
      console.log(`已更新 ${totalUpdated} 个配置`);
    }

    // 恢复原始预设
    if (originalPreset && presetNames.includes(originalPreset)) {
      TavernHelper.loadPreset(originalPreset);
      console.log(`已恢复原始预设: ${originalPreset}`);
    }

    // 清除缓存并重新渲染
    clearConfigCache();
    await renderConfigsList();

    toastr.success(`自动创建完成！为 ${presetIdentifierMap.size} 个预设创建了识别条目，更新了 ${totalUpdated} 个配置`);
    console.log('自动创建识别条目完成');
  } catch (error) {
    console.error('自动创建识别条目失败:', error);
    toastr.error('自动创建识别条目失败，请检查控制台日志');
  }
}

export async function renameConfig(configId: string): Promise<void> {
  const configs = await getStoredConfigs();
  const configToRename = configs[configId];
  if (!configToRename) {
    toastr.error('找不到要重命名的配置。');
    return;
  }

  const oldName = configToRename.name;
  const newName = await triggerSlash(`/input default="${oldName}" "请输入新的配置名称"`);

  if (newName && newName.trim() !== '') {
    configs[configId].name = newName.trim();
    await setStoredConfigs(configs);
    clearConfigCache(); // 清除配置缓存
    toastr.success(`配置已从 "${oldName}" 重命名为 "${newName.trim()}"。`);
    await renderConfigsList();
    updateConfigListCache(); // 更新UI缓存
  } else {
    toastr.info('重命名操作已取消。');
  }
}

export async function updateConfig(configId: string): Promise<void> {
  try {
    const configs = await getStoredConfigs();
    const oldConfig = configs[configId];
    if (!oldConfig) {
      toastr.error(`配置不存在，无法更新。`);
      return;
    }

    const loadedPresetName = TavernHelper.getLoadedPresetName();
    const preset = TavernHelper.getPreset('in_use');
    const allPrompts = [...preset.prompts, ...preset.prompts_unused];
    const currentPromptStates = allPrompts.map((p: { id: string; enabled: boolean; name: string }) => ({
      id: p.id,
      enabled: p.enabled,
      name: p.name,
    }));

    const configToSave: ConfigData = {
      ...oldConfig,
      presetName: loadedPresetName,
      states: currentPromptStates,
    };

    const updateRegexChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "是否要同时更新此配置的正则开关状态？"`,
    );
    if (updateRegexChoice === '1') {
      const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
      const newRegexStates = allRegexes.map((regex: { id: string; enabled: boolean }) => ({
        id: regex.id,
        enabled: regex.enabled,
      }));
      configToSave.regexStates = newRegexStates;
      toastr.info('已同步更新正则状态。');
    }

    const oldStateIds = new Set(oldConfig.states.map(s => s.id));
    const newEntries = configToSave.states.filter(s => !oldStateIds.has(s.id));

    if (newEntries.length > 0) {
      const promptIdToNameMap = new Map(currentPromptStates.map((p: { id: string; name: string }) => [p.id, p.name]));
      const userChoices = await showNewEntriesPopup(newEntries, promptIdToNameMap);

      if (userChoices !== null) {
        const choicesMap = new Map(
          userChoices.map((choice: { id: string; enabled: boolean }) => [choice.id, choice.enabled]),
        );
        configToSave.states.forEach(state => {
          if (choicesMap.has(state.id)) state.enabled = choicesMap.get(state.id) as boolean;
        });
      } else {
        toastr.info('已为新条目保留默认状态。');
      }
    }

    configs[configId] = configToSave;
    await setStoredConfigs(configs);
    clearConfigCache(); // 清除配置缓存

    toastr.success(`配置 "${configToSave.name}" 已更新。`);
    await renderConfigsList();
    updateConfigListCache(); // 更新UI缓存
  } catch (error) {
    console.error('更新预设配置失败:', error);
    toastr.error('更新预设配置失败，请检查控制台获取更多信息。');
  }
}

export async function saveCurrentConfig(): Promise<void> {
  // 先创建识别条目，然后通过识别条目ID获取正确的预设名称
  const identifierId = await createOrGetIdentifierPrompt();
  if (!identifierId) {
    toastr.error('无法创建识别条目，配置保存失败');
    return;
  }

  // 获取当前预设名称（用于显示和向后兼容）
  let currentPresetName = await getPresetNameByIdentifier(identifierId);
  if (!currentPresetName) {
    toastr.error('无法识别当前预设，配置保存失败');
    return;
  }

  // 如果获取到的是"in_use"，需要转换为当前实际使用的预设名称
  if (currentPresetName === 'in_use') {
    const actualPresetName = TavernHelper.getLoadedPresetName();
    currentPresetName = actualPresetName !== 'in_use' ? actualPresetName : 'in_use';
    console.log(`通过识别条目ID找到in_use，转换为当前实际预设名称: ${currentPresetName}`);
  }

  const blacklist = ['恶灵低语', 'deepspay', 'spaymale', '深阉', '小骡之神', '小猫之神', 'kemini'];
  if (blacklist.some(keyword => currentPresetName.toLowerCase().includes(keyword))) {
    toastr.warning('*你使用了作者黑名单的预设哦（盯）*');
    return;
  }

  const nameInput = $('#preset-manager-name-input');
  const configName = nameInput.val()?.toString().trim();
  if (!configName) {
    toastr.error('请输入配置名称。');
    return;
  }

  try {
    console.log('当前预设名称:', currentPresetName);
    console.log('识别条目ID:', identifierId);

    const preset = TavernHelper.getPreset('in_use');
    const allPrompts = [...preset.prompts, ...preset.prompts_unused];
    const promptStates = allPrompts.map((p: { id: string; enabled: boolean; name: string }) => ({
      id: p.id,
      enabled: p.enabled,
      name: p.name,
    }));
    const configToSave: ConfigData = {
      id: generateUniqueId(),
      name: configName,
      presetName: currentPresetName, // 使用实际的预设名称而不是"in_use"
      identifierId: identifierId, // 使用识别条目ID进行可靠的预设识别
      states: promptStates,
    };

    if ($('#preset-manager-bind-char').is(':checked')) {
      const charData = await TavernHelper.getCharData('current');
      if (charData && charData.avatar) {
        configToSave.boundCharAvatar = charData.avatar;
        configToSave.boundCharName = charData.name;
      } else {
        toastr.warning('无法获取当前角色信息，配置未绑定。');
      }
    }

    const configs = await getStoredConfigs();
    configs[configToSave.id] = configToSave;
    await setStoredConfigs(configs);
    clearConfigCache(); // 清除配置缓存

    toastr.success(`配置 "${configName}" 已保存。`);
    nameInput.val('');
    $('#preset-manager-bind-char').prop('checked', false);
    await renderConfigsList();
    updateConfigListCache(); // 更新UI缓存
  } catch (error) {
    console.error('保存预设配置失败:', error);
    toastr.error('保存预设配置失败，请检查控制台获取更多信息。');
  }
}

export async function loadConfig(configId: string, shouldToggleUI = true): Promise<void> {
  try {
    const configs = await getStoredConfigs();
    const configToLoad = configs[configId];
    if (!configToLoad) {
      toastr.error(`配置不存在。`);
      return;
    }

    // 优先使用识别条目ID查找预设，如果没有则回退到预设名称
    let targetPresetName: string | null = null;

    if (configToLoad.identifierId) {
      // 使用识别条目ID查找预设
      targetPresetName = await getPresetNameByIdentifier(configToLoad.identifierId);
      if (targetPresetName) {
        // 如果找到的是"in_use"，需要转换为当前正在使用的实际预设名称
        if (targetPresetName === 'in_use') {
          const currentPresetName = TavernHelper.getLoadedPresetName();
          targetPresetName = currentPresetName !== 'in_use' ? currentPresetName : 'in_use';
          console.log('通过识别条目ID找到in_use，转换为当前预设:', targetPresetName);
        } else {
          console.log('通过识别条目ID找到预设:', targetPresetName);
        }
      } else {
        console.warn('无法通过识别条目ID找到预设，尝试使用预设名称');
      }
    }

    // 如果通过识别条目ID没找到，尝试使用预设名称（向后兼容）
    if (!targetPresetName && configToLoad.presetName) {
      if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
        targetPresetName = configToLoad.presetName;
        console.log('通过预设名称找到预设:', targetPresetName);
      } else {
        console.warn(`预设 "${configToLoad.presetName}" 不存在，尝试扫描所有预设查找识别条目`);
        // 如果预设名称也不存在，尝试扫描所有预设查找识别条目
        if (configToLoad.identifierId) {
          targetPresetName = await getPresetNameByIdentifier(configToLoad.identifierId);
        }
      }
    }

    if (targetPresetName) {
      // 加载预设
      if (TavernHelper.loadPreset(targetPresetName)) {
        toastr.info(`已切换到预设 "${targetPresetName}"。`);
        await new Promise(resolve => setTimeout(resolve, 500));

        // 确保目标预设中有识别条目
        if (configToLoad.identifierId) {
          await ensureIdentifierInCurrentPreset(configToLoad.identifierId);
        }
      } else {
        toastr.error(`加载预设 "${targetPresetName}" 失败。`);
        return;
      }
    } else {
      toastr.warning(`无法找到对应的预设，将仅对当前预设应用条目状态。`);
    }

    const promptStates = configToLoad.states;
    if (!promptStates || !Array.isArray(promptStates)) {
      toastr.error(`配置 "${configToLoad.name}" 数据格式不正确或为空。`);
      return;
    }

    const statesMap = new Map(promptStates.map(s => [s.id, s.enabled]));
    await TavernHelper.updatePresetWith('in_use', preset => {
      [...preset.prompts, ...preset.prompts_unused].forEach((prompt: any) => {
        if (statesMap.has(prompt.id)) prompt.enabled = statesMap.get(prompt.id) as boolean;
      });
      return preset;
    });

    if (configToLoad.regexStates && Array.isArray(configToLoad.regexStates)) {
      const statesToApply = new Map(configToLoad.regexStates.map(r => [r.id, r.enabled]));
      if (statesToApply.size > 0) {
        await TavernHelper.updateTavernRegexesWith(
          regexes => {
            regexes.forEach((regex: any) => {
              if (regex.scope === 'global' && statesToApply.has(regex.id)) {
                regex.enabled = statesToApply.get(regex.id) as boolean;
              }
            });
            return regexes;
          },
          { scope: 'global' },
        );
        toastr.success(`已应用配置 "${configToLoad.name}" 绑定的全局正则。`);
      }
    }

    toastr.success(`已加载配置 "${configToLoad.name}"。`);

    // 加载配置后触发分组恢复
    setTimeout(() => {
      triggerGroupingRestore();
    }, 500);

    if (shouldToggleUI) {
      toggleUI();
    }
  } catch (error) {
    console.error('加载预设配置失败:', error);
    toastr.error('加载预设配置失败，请检查控制台获取更多信息。');
  }
}

export async function deleteConfig(configId: string): Promise<void> {
  try {
    const configs = await getStoredConfigs();
    const configToDelete = configs[configId];
    if (configToDelete) {
      delete configs[configId];
      await setStoredConfigs(configs);
      clearConfigCache(); // 清除配置缓存
      toastr.success(`已删除配置 "${configToDelete.name}"。`);
      await renderConfigsList();
      updateConfigListCache(); // 更新UI缓存
    } else {
      toastr.warning(`配置不存在。`);
    }
  } catch (error) {
    console.error('删除配置失败:', error);
    toastr.error('删除配置失败，请检查控制台获取更多信息。');
  }
}
