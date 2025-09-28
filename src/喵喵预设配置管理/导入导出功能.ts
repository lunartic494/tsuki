import { generateUniqueId } from './初始化和配置';
import { exportPresetGrouping, importPresetGrouping, PromptGroup } from './条目分组功能';
import { importRegexLogic } from './正则绑定功能';
import { getStoredConfigs, renderConfigsList, setStoredConfigs } from './配置存储和读取';

export async function exportConfig(configId: string): Promise<void> {
  try {
    const configs = await getStoredConfigs();
    const configData = configs[configId];

    if (!configData) {
      toastr.error(`配置不存在，无法导出。`);
      return;
    }
    const configName = configData.name;

    let userRemark = '';
    const addRemarkChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "是否要为此导出添加备注信息？"`,
    );
    if (addRemarkChoice === '1') {
      userRemark = await triggerSlash(
        `/input multiline=true placeholder="请输入备注，例如预设用途、来源等..." "添加备注"`,
      );
    }

    const exportBundle = {
      type: 'MiaoMiaoPresetBundle',
      version: 1,
      remark: userRemark || '',
      presetConfig: configData,
      presetData: null,
      regexData: null,
      groupingConfig: null,
    };

    const configPresetName = configData.presetName;
    if (configPresetName && TavernHelper.getPresetNames().includes(configPresetName)) {
      const includePresetChoice = await triggerSlash(
        `/popup okButton="是" cancelButton="否" result=true "此配置关联了预设 \\"${configPresetName}\\"。是否要将预设文件本身一起打包导出？"`,
      );
      if (includePresetChoice === '1') {
        const presetData = TavernHelper.getPreset(configPresetName);
        if (presetData) {
          // 如果配置的presetName是"in_use"，需要获取当前实际使用的预设名称
          let actualPresetName = configPresetName;
          if (configPresetName === 'in_use') {
            const currentPresetName = TavernHelper.getLoadedPresetName();
            actualPresetName = currentPresetName !== 'in_use' ? currentPresetName : 'in_use';
            console.log(`配置presetName为in_use，使用当前实际预设名称: ${actualPresetName}`);
          }
          (presetData as any).name = actualPresetName;
          (exportBundle as any).presetData = presetData;
          toastr.info(`已将预设 "${actualPresetName}" 打包。`);
        } else {
          toastr.warning(`无法获取预设 "${configPresetName}" 的数据。`);
        }
      }
    }

    if (configData.regexStates && configData.regexStates.length > 0) {
      const userChoice = await triggerSlash(
        `/popup okButton="是" cancelButton="否" result=true "此配置绑定了正则。是否选择要一起导出的正则？"`,
      );
      if (userChoice === '1') {
        const boundRegexIds = new Set(configData.regexStates.map(r => r.id));
        const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
        const boundRegexes = allGlobalRegexes.filter((r: any) => boundRegexIds.has(r.id));

        const { showRegexExportSelectionPopup } = await import('./辅助弹窗功能');
        const selectedRegexes = await showRegexExportSelectionPopup(boundRegexes);

        if (selectedRegexes) {
          (exportBundle as any).regexData = selectedRegexes;
          toastr.info(`已将 ${selectedRegexes.length} 条正则打包导出。`);
        } else {
          toastr.info('已取消导出正则。');
        }
      }
    }

    // 检查是否包含分组配置
    const groupingPresetName = configData.presetName;
    if (groupingPresetName) {
      const groupingConfig = await exportPresetGrouping(groupingPresetName);
      if (groupingConfig) {
        const includeGroupingChoice = await triggerSlash(
          `/popup okButton="是" cancelButton="否" result=true "预设 \\"${groupingPresetName}\\" 包含条目分组设置。是否要一起导出？"`,
        );
        if (includeGroupingChoice === '1') {
          (exportBundle as any).groupingConfig = groupingConfig;
          toastr.info('已将分组设置打包导出。');
        }
      }
    }

    const defaultFileName = `${configName}_bundle`;
    let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入导出的文件名（无需后缀）"`);

    if (!userFileName || userFileName.trim() === '') {
      userFileName = defaultFileName;
      toastr.info('文件名为空，已使用默认名称。');
    }
    userFileName = userFileName.trim().replace(/\.json$/, '');

    const jsonString = JSON.stringify(exportBundle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${userFileName}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();

    toastr.success(`配置包 "${configName}" 已导出。`);
  } catch (error) {
    console.error('导出配置失败:', error);
    toastr.error('导出配置失败，请检查控制台获取更多信息。');
  }
}

export async function handleFileImport(event: any): Promise<void> {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async e => {
    try {
      const content = e.target?.result as string;
      const parsedContent = JSON.parse(content);

      if (parsedContent.entries && typeof parsedContent.entries === 'object') {
        toastr.info('检测到世界书备份文件。');
        const configsToImport = [];
        for (const entry of Object.values(parsedContent.entries)) {
          if ((entry as any).content) {
            try {
              const config = JSON.parse((entry as any).content);
              if (config.id && config.name && Array.isArray(config.states)) {
                configsToImport.push(config);
              }
            } catch (err) {
              // 忽略解析失败的条目
            }
          }
        }
        if (configsToImport.length > 0) {
          const { startBatchImportFlow } = await import('./批量操作功能');
          await startBatchImportFlow(configsToImport);
        } else {
          toastr.warning('世界书文件中未找到有效的喵喵配置数据。');
        }
        return;
      }

      if (parsedContent.remark) {
        const { showRemarkPopup } = await import('./辅助弹窗功能');
        await showRemarkPopup(parsedContent.remark);
      }

      if (parsedContent.type === 'MiaoMiaoPresetMegaBundle') {
        const { handleMegaBundleImport } = await import('./批量操作功能');
        await handleMegaBundleImport(parsedContent);
        return;
      }

      let configToImport, presetToImport, regexToImport, groupingToImport;

      if (parsedContent.type === 'MiaoMiaoPresetBundle') {
        console.log('检测到整合包文件，版本:', parsedContent.version);
        toastr.info('检测到整合包文件。');
        configToImport = parsedContent.presetConfig;
        presetToImport = parsedContent.presetData;
        regexToImport = parsedContent.regexData;
        groupingToImport = parsedContent.groupingConfig;
        console.log('分组配置:', groupingToImport);
      } else {
        configToImport = parsedContent;
      }

      if (!configToImport || typeof configToImport.presetName !== 'string' || !Array.isArray(configToImport.states)) {
        toastr.error('导入失败：配置数据格式不正确。');
        return;
      }

      if (presetToImport) {
        const importPresetChoice = await triggerSlash(
          `/popup okButton="是" cancelButton="否" result=true "此文件包含预设文件 \\"${presetToImport.name}\\"。是否导入/覆盖？"`,
        );
        if (importPresetChoice === '1') {
          await TavernHelper.createOrReplacePreset(presetToImport.name, presetToImport);
          toastr.success(`预设文件 "${presetToImport.name}" 已导入。`);
        }
      }

      if (regexToImport && regexToImport.length > 0) {
        await importRegexLogic(regexToImport);
      }

      // 处理分组配置导入
      if (groupingToImport && Array.isArray(groupingToImport) && groupingToImport.length > 0) {
        if (configToImport.presetName) {
          try {
            console.log('导入分组配置:', groupingToImport);
            await importPresetGrouping(configToImport.presetName, groupingToImport as PromptGroup[]);
            toastr.success('已成功导入并应用分组设置到预设。');
          } catch (error) {
            console.error('导入分组配置失败:', error);
            toastr.error('导入分组配置失败：' + (error as Error).message);
          }
        } else {
          console.warn('配置中没有预设名称，无法导入分组配置');
        }
      }

      const initialName = configToImport.name || file.name.replace(/_bundle\.json$/i, '').replace(/\.json$/i, '');
      let configName = await triggerSlash(`/input default="${initialName}" "请输入导入配置的名称"`);
      configName = configName.trim();
      if (!configName) {
        toastr.info('导入已取消。');
        return;
      }

      const configs = await getStoredConfigs();
      configToImport.name = configName;
      configToImport.id = generateUniqueId(); // Always generate new ID for single import
      configs[configToImport.id] = configToImport;
      await setStoredConfigs(configs);

      toastr.success(`配置 "${configName}" 已成功导入。`);
      await renderConfigsList();
    } catch (error) {
      console.error('导入文件失败:', error);
      toastr.error('导入文件失败，请检查控制台获取更多信息。');
    } finally {
      $(event.target).val('');
    }
  };
  reader.readAsText(file);
}
