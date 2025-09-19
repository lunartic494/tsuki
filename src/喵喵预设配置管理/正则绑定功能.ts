import { showRegexDeletionPopup } from './辅助弹窗功能';
import { getStoredConfigs, renderConfigsList, setStoredConfigs } from './配置存储和读取';

export async function showRegexBindingPopup(configId: string): Promise<void> {
  const popupId = 'preset-manager-regex-popup';
  $(`#${popupId}`).remove();

  try {
    const allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
    if (allRegexes.length === 0) {
      toastr.info('没有可绑定的全局正则。');
      return;
    }

    const configs = await getStoredConfigs();
    const currentConfig = configs[configId];
    if (!currentConfig) return;
    const savedStates = new Map(currentConfig.regexStates?.map(r => [r.id, r.enabled]) ?? []);

    const regexesHtml = allRegexes
      .map((regex: any) => {
        const isChecked = savedStates.has(regex.id) ? savedStates.get(regex.id) : regex.enabled;
        const safeName = $('<div/>').text(regex.script_name).html();
        return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="regex-toggle-${regex.id}" data-id="${regex.id}" ${isChecked ? 'checked' : ''}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
      })
      .join('');

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">请选择绑定正则</h4>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-bind-clear" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; color:#fff;">清除绑定</button>
                        <button id="regex-bind-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-bind-save" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">保存</button>
                    </div>
                </div>
            </div>
        `;
    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#regex-bind-cancel').on('click', () => $(`#${popupId}`).remove());

    $('#regex-bind-clear').on('click', async () => {
      const configs = await getStoredConfigs();
      if (configs[configId] && configs[configId].regexStates) {
        delete configs[configId].regexStates;
        await setStoredConfigs(configs);
        toastr.success(`配置 "${configs[configId].name}" 的正则绑定已清除。`);
      } else {
        toastr.info(`配置没有正则绑定。`);
      }
      $(`#${popupId}`).remove();
      renderConfigsList();
    });

    $('#regex-bind-save').on('click', async () => {
      const newRegexStates = allRegexes.map((regex: any) => ({
        id: regex.id,
        enabled: $(`#regex-toggle-${regex.id}`).is(':checked'),
      }));

      const configs = await getStoredConfigs();
      if (!configs[configId]) return;

      configs[configId].regexStates = newRegexStates;
      await setStoredConfigs(configs);

      toastr.success(`配置 "${configs[configId].name}" 的正则绑定已保存。`);
      $(`#${popupId}`).remove();
      renderConfigsList();

      const currentPresetName = configs[configId].presetName;
      if (!currentPresetName) return;

      const otherConfigIds = Object.keys(configs).filter(
        id => id !== configId && configs[id].presetName === currentPresetName,
      );

      if (otherConfigIds.length > 0) {
        const confirmMessage = `是否要将此正则绑定应用到其他使用预设 "${currentPresetName}" 的 ${otherConfigIds.length} 个配置上？`;
        const userChoice = await triggerSlash(
          `/popup okButton="应用" cancelButton="取消" result=true "${confirmMessage}"`,
        );

        if (userChoice === '1') {
          otherConfigIds.forEach(id => {
            configs[id].regexStates = newRegexStates;
          });
          await setStoredConfigs(configs);
          toastr.success(`已成功将正则绑定应用到 ${otherConfigIds.length} 个同名预设配置上。`);
        }
      }
    });
  } catch (error) {
    console.error('打开正则绑定界面失败:', error);
    toastr.error('无法加载全局正则列表。');
  }
}

export function sortRegexes(regexes: any[]): any[] {
  const getSortNumber = (name: string): number => {
    const match = name.trim().match(/^(?:\[|【|\(|（)?(\d+)(?:\]|】|\)|）|\.|-|_|\s)?/);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return Infinity;
  };

  return regexes.sort((a, b) => {
    const numA = getSortNumber(a.script_name);
    const numB = getSortNumber(b.script_name);

    if (numA !== numB) {
      return numA - numB;
    }
    return a.script_name.localeCompare(b.script_name);
  });
}

export async function importRegexLogic(regexToImport: any[]): Promise<void> {
  const currentRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
  let remainingRegexes = currentRegexes;

  if (currentRegexes && currentRegexes.length > 0) {
    remainingRegexes = await showRegexDeletionPopup(currentRegexes);
  }

  const combinedRegexes = [...regexToImport, ...remainingRegexes];
  const sortedRegexes = sortRegexes(combinedRegexes);

  await TavernHelper.replaceTavernRegexes(sortedRegexes, { scope: 'global' });
  toastr.success(`成功导入 ${regexToImport.length} 条正则，并重新排序。`);
}
