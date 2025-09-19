import { generateUniqueId } from './初始化和配置';
import { importRegexLogic } from './正则绑定功能';
import { showBatchImportConfigSelectionPopup, showRegexExportSelectionPopup } from './辅助弹窗功能';
import { ConfigData, getStoredConfigs, renderConfigsList, setStoredConfigs } from './配置存储和读取';

export async function showBatchExportPopup(): Promise<void> {
  const popupId = 'preset-manager-batch-export-popup';
  $(`#${popupId}`).remove();

  const configs = Object.values(await getStoredConfigs());

  if (configs.length === 0) {
    toastr.info('没有可导出的配置。');
    return;
  }

  const configsHtml = configs
    .map(config => {
      const safeName = $('<div/>').text(config.name).html();
      return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-export-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span>${safeName}</span>
                </label>
            </div>
        `;
    })
    .join('');

  const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要批量导出的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                </div>
            </div>
        </div>
    `;

  $('body').append(popupHtml);

  const mobileStyles = `<style>
        @media (max-width: 600px) { #${popupId} > div { margin-top: 5vh; } }
    </style>`;
  $(`#${popupId}`).append(mobileStyles);

  $('#batch-export-select-all').on('click', () => $('.pm-batch-export-item').prop('checked', true));
  $('#batch-export-deselect-all').on('click', () => $('.pm-batch-export-item').prop('checked', false));
  $('#batch-export-cancel').on('click', () => $(`#${popupId}`).remove());
  $('#batch-export-confirm').on('click', async () => {
    const selectedIds = new Set<string>();
    $('.pm-batch-export-item:checked').each(function () {
      selectedIds.add($(this).val() as string);
    });
    const allConfigs = await getStoredConfigs();
    const selectedConfigs = Object.values(allConfigs).filter(c => selectedIds.has(c.id));
    batchExportConfigs(selectedConfigs);
    $(`#${popupId}`).remove();
  });
}

async function batchExportConfigs(selectedConfigs: ConfigData[]): Promise<void> {
  if (selectedConfigs.length === 0) {
    toastr.info('未选择任何配置。');
    return;
  }

  try {
    let userRemark = '';
    const addRemarkChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "是否要为这个批量导出的整合包添加备注信息？"`,
    );
    if (addRemarkChoice === '1') {
      userRemark = await triggerSlash(
        `/input multiline=true placeholder="请输入备注，例如这批配置的共同特点..." "为整合包添加备注"`,
      );
    }

    const megaBundle = {
      type: 'MiaoMiaoPresetMegaBundle',
      version: 1,
      remark: userRemark || '',
      presetConfigs: {} as Record<string, ConfigData>,
      presets: {} as Record<string, any>,
      regexData: [] as any[],
    };

    const uniquePresetNames = new Set<string>();

    for (const configData of selectedConfigs) {
      megaBundle.presetConfigs[configData.id] = configData;
      if (configData.presetName) {
        uniquePresetNames.add(configData.presetName);
      }
    }

    if (uniquePresetNames.size > 0) {
      const presetList = Array.from(uniquePresetNames).join(', ');
      const includePresetsChoice = await triggerSlash(
        `/popup okButton="是" cancelButton="否" result=true "您选择的配置关联了以下预设：${presetList}。是否要将这些预设文件一同打包导出？"`,
      );
      if (includePresetsChoice === '1') {
        let includedCount = 0;
        for (const presetName of uniquePresetNames) {
          if (TavernHelper.getPresetNames().includes(presetName)) {
            const presetData = TavernHelper.getPreset(presetName);
            if (presetData) {
              megaBundle.presets[presetName] = presetData;
              includedCount++;
            }
          }
        }
        toastr.info(`已将 ${includedCount} 个预设文件打包。`);
      } else {
        toastr.info('跳过预设文件导出。');
      }
    }

    const includeRegexChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "是否需要选择一些全局正则脚本一同打包导出？"`,
    );
    if (includeRegexChoice === '1') {
      const allGlobalRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
      if (allGlobalRegexes.length === 0) {
        toastr.info('没有可供导出的全局正则脚本。');
      } else {
        const selectedRegexes = await showRegexExportSelectionPopup(allGlobalRegexes);
        if (selectedRegexes) {
          megaBundle.regexData = selectedRegexes;
          toastr.info(`已将 ${selectedRegexes.length} 条正则打包。`);
        } else {
          toastr.info('已取消选择正则，将不导出任何正则脚本。');
        }
      }
    } else {
      toastr.info('跳过正则导出。');
    }

    const defaultFileName = 'MiaoMiao_Batch_Export';
    let userFileName = await triggerSlash(`/input default="${defaultFileName}" "请输入批量导出的文件名（无需后缀）"`);

    if (!userFileName || userFileName.trim() === '') {
      userFileName = defaultFileName;
      toastr.info('文件名为空，已使用默认名称。');
    }
    userFileName = userFileName.trim().replace(/\.json$/, '');

    const jsonString = JSON.stringify(megaBundle, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${userFileName}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();

    toastr.success(`已成功导出 ${selectedConfigs.length} 个配置的整合包。`);
  } catch (error) {
    console.error('批量导出失败:', error);
    toastr.error('批量导出失败，请检查控制台。');
  }
}

export async function startBatchImportFlow(configsToImport: ConfigData[]): Promise<void> {
  const userChoices = await showBatchImportConfigSelectionPopup(configsToImport);

  if (!userChoices) {
    toastr.info('配置导入已取消。');
    return;
  }

  const importList = userChoices.filter((choice: any) => choice.import);
  if (importList.length === 0) {
    toastr.info('未选择要导入的配置。');
    return;
  }

  const storedConfigs = await getStoredConfigs();
  importList.forEach((choice: any) => {
    const config = configsToImport.find(c => c.id === choice.originalId);
    if (config) {
      const newConfig = { ...config }; // Create a copy
      newConfig.name = choice.newName;
      newConfig.id = generateUniqueId(); // Assign a new unique ID on import
      storedConfigs[newConfig.id] = newConfig;
    }
  });

  await setStoredConfigs(storedConfigs);
  toastr.success(`成功导入 ${importList.length} 个配置。`);
  await renderConfigsList();
}

export async function handleMegaBundleImport(megaBundle: any): Promise<void> {
  // 1. 导入预设
  const presetsToImport = megaBundle.presets;
  if (presetsToImport && Object.keys(presetsToImport).length > 0) {
    const presetNames = Object.keys(presetsToImport).join(', ');
    const importPresetChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "此文件包含预设: ${presetNames}。是否全部导入/覆盖？"`,
    );
    if (importPresetChoice === '1') {
      for (const presetName in presetsToImport) {
        await TavernHelper.createOrReplacePreset(presetName, presetsToImport[presetName]);
      }
      toastr.success(`已导入 ${Object.keys(presetsToImport).length} 个预设。`);
    }
  }

  // 2. 导入正则
  const regexToImport = megaBundle.regexData;
  if (regexToImport && regexToImport.length > 0) {
    const importRegexChoice = await triggerSlash(
      `/popup okButton="是" cancelButton="否" result=true "此文件包含 ${regexToImport.length} 条正则脚本。是否导入？"`,
    );
    if (importRegexChoice === '1') {
      await importRegexLogic(regexToImport);
    }
  }

  // 3. 导入配置
  const configsToImport = Object.values(megaBundle.presetConfigs);
  await startBatchImportFlow(configsToImport);
}

export async function showBatchDeletePopup(): Promise<void> {
  const popupId = 'preset-manager-batch-delete-popup';
  $(`#${popupId}`).remove();

  const configs = Object.values(await getStoredConfigs());
  if (configs.length === 0) {
    toastr.info('没有可删除的配置。');
    return;
  }

  const configsHtml = configs
    .map(config => {
      const safeName = $('<div/>').text(config.name).html();
      return `
            <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center;">
                <label style="cursor:pointer; display:flex; align-items:center; width: 100%;">
                    <input type="checkbox" class="pm-batch-delete-item" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <span title="${safeName}">${safeName}</span>
                </label>
            </div>
        `;
    })
    .join('');

  const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#c62828; text-align: center;">选择要批量删除的配置</h4>
                <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                   <button id="batch-delete-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                   <button id="batch-delete-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                </div>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                    ${configsHtml}
                </div>
                <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                    <button id="batch-delete-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                    <button id="batch-delete-confirm" style="padding: 8px 16px; background-color:#f44336; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">确认删除</button>
                </div>
            </div>
        </div>
    `;

  $('body').append(popupHtml);
  const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 200px; } }</style>`;
  $(`#${popupId}`).append(mobileStyles);

  $('#batch-delete-select-all').on('click', () => $('.pm-batch-delete-item').prop('checked', true));
  $('#batch-delete-deselect-all').on('click', () => $('.pm-batch-delete-item').prop('checked', false));
  $('#batch-delete-cancel').on('click', () => $(`#${popupId}`).remove());
  $('#batch-delete-confirm').on('click', () => {
    const selectedIds: string[] = [];
    $('.pm-batch-delete-item:checked').each(function () {
      selectedIds.push($(this).val() as string);
    });
    batchDeleteConfigs(selectedIds);
    $(`#${popupId}`).remove();
  });
}

async function batchDeleteConfigs(configIds: string[]): Promise<void> {
  if (configIds.length === 0) {
    toastr.info('未选择任何要删除的配置。');
    return;
  }

  const confirm = await triggerSlash(
    `/popup okButton="确认删除" cancelButton="取消" result=true "警告：您确定要删除选中的 ${configIds.length} 个配置吗？此操作无法撤销。"`,
  );
  if (confirm !== '1') {
    toastr.info('批量删除操作已取消。');
    return;
  }

  try {
    const storedConfigs = await getStoredConfigs();
    const idsToDelete = new Set(configIds);
    Object.keys(storedConfigs).forEach(id => {
      if (idsToDelete.has(id)) delete storedConfigs[id];
    });
    await setStoredConfigs(storedConfigs);
    toastr.success(`已成功删除 ${configIds.length} 个配置。`);
    await renderConfigsList();
  } catch (error) {
    console.error('批量删除失败:', error);
    toastr.error('批量删除失败，请检查控制台。');
  }
}
