import { generateUniqueId } from './初始化和配置';
import { toggleUI } from './界面创建和管理';
import { showNewEntriesPopup } from './辅助弹窗功能';
import { ConfigData, getStoredConfigs, renderConfigsList, setStoredConfigs } from './配置存储和读取';

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
    toastr.success(`配置已从 "${oldName}" 重命名为 "${newName.trim()}"。`);
    await renderConfigsList();
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

    toastr.success(`配置 "${configToSave.name}" 已更新。`);
    await renderConfigsList();
  } catch (error) {
    console.error('更新预设配置失败:', error);
    toastr.error('更新预设配置失败，请检查控制台获取更多信息。');
  }
}

export async function saveCurrentConfig(): Promise<void> {
  const loadedPresetName = TavernHelper.getLoadedPresetName();
  const blacklist = ['恶灵低语', 'deepspay', 'spaymale', '深阉', '小骡之神', '小猫之神', 'kemini'];
  if (blacklist.some(keyword => loadedPresetName.toLowerCase().includes(keyword))) {
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
      presetName: loadedPresetName,
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

    toastr.success(`配置 "${configName}" 已保存。`);
    nameInput.val('');
    $('#preset-manager-bind-char').prop('checked', false);
    await renderConfigsList();
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

    if (configToLoad.presetName) {
      if (TavernHelper.getPresetNames().includes(configToLoad.presetName)) {
        if (TavernHelper.loadPreset(configToLoad.presetName)) {
          toastr.info(`已切换到预设 "${configToLoad.presetName}"。`);
          await new Promise(resolve => setTimeout(resolve, 150));
        } else {
          toastr.error(`加载预设 "${configToLoad.presetName}" 失败。`);
          return;
        }
      } else {
        toastr.warning(`配置关联的预设 "${configToLoad.presetName}" 不存在。将仅对当前预设应用条目状态。`);
      }
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
      toastr.success(`已删除配置 "${configToDelete.name}"。`);
      await renderConfigsList();
    } else {
      toastr.warning(`配置不存在。`);
    }
  } catch (error) {
    console.error('删除配置失败:', error);
    toastr.error('删除配置失败，请检查控制台获取更多信息。');
  }
}
