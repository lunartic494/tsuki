import { ConfigData } from './配置存储和读取';

export function showHelpPopup(): void {
  const popupId = 'preset-manager-help-popup';
  $(`#${popupId}`).remove();

  const helpContent = `
        <div style="padding: 0 10px; font-size: 14px; line-height: 1.6;">
            <h5>主要功能</h5>
            <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #4CAF50;">
                    <b>保存/更新配置:</b> 保存或更新当前预设中所有"条目"的启用/禁用状态。更新时可选择是否同步正则状态。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #2196F3;">
                    <b>加载配置:</b> 一键切换到指定的预设并将所有"条目"恢复到已保存的状态。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF9800;">
                    <b>查看配置:</b> 在"更多"菜单中点击"查看"，可详细查看配置的基本信息、条目状态统计、启用/禁用的具体条目列表和绑定的正则信息。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #9C27B0;">
                    <b>预设编辑器:</b> 强大的条目管理工具，支持创建、编辑、删除条目，以及多级分组管理。所有修改会实时保存到浏览器本地存储，分组设置与当前预设绑定。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #00BCD4;">
                    <b>导入/导出:</b> 以 .json 文件的形式分享单个配置。导出时可以为配置包添加备注，方便分享和识别。整合包可以附带预设本身、绑定的正则和分组配置。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #795548;">
                    <b>兼容世界书导入:</b> 支持直接导入通过酒馆世界书功能导出的、含有本插件数据的备份文件。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #607D8B;">
                    <b>批量导入/导出:</b> 一次性分享多个配置、关联的预设和正则脚本，方便备份和迁移。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #F44336;">
                    <b>批量删除:</b> 在主界面勾选多个配置进行一次性删除，方便清理。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #E91E63;">
                    <b>角色绑定:</b> 将配置与特定角色关联，切换到该角色时会自动提示加载。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #3F51B5;">
                    <b>正则绑定:</b> 将配置与一组全局正则的开关状态关联，加载配置时会自动应用。
                </li>
                <li style="margin-bottom: 16px; padding: 12px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #FF5722;">
                    <b>重命名与分组:</b> 您可以重命名任何配置，同名预设的配置会自动折叠在一个分组下，使界面更清晰。
                </li>
            </ul>
        </div>
    `;

  const usageNotice = `
        <div style="padding: 12px; font-size: 14px; line-height: 1.6; background-color: #f9f3ea; border-radius: 8px; margin-top: 15px;">
            <h5 style="color: #c62828; margin-top:0;">使用须知</h5>
            <p style="font-weight: bold; margin-bottom: 0;">
                本脚本免费在旅程、喵喵电波服务器发布，作者MoM小n，不允许某个虐男char预设与该作者另一个梦女预设使用，也不支持鉴抄MoM那位的预设使用。
            </p>
        </div>
    `;

  const popupHtml = `
        <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
            <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px; flex-shrink: 0;">喵喵预设配置管理 - 使用说明</h4>
                <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
                    ${helpContent}
                </div>
                ${usageNotice}
                <div style="text-align: right; margin-top: 15px; flex-shrink: 0;">
                    <button id="help-popup-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
                </div>
            </div>
        </div>
    `;
  $('body').append(popupHtml);
  const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 10vh; max-height: 75vh !important; } }</style>`;
  $(`#${popupId}`).append(mobileStyles);
  $('#help-popup-close').on('click', () => $(`#${popupId}`).remove());
}

export function showRemarkPopup(remarkText: string): Promise<boolean> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-remark-popup';
    $(`#${popupId}`).remove();

    // Simple Markdown to HTML converter
    function convertMarkdown(text: string): string {
      const sanitize = (s: string) => $('<div/>').text(s).html();
      const lines = text.split('\n');
      let html = '';
      let inList = false;

      const processInline = (line: string) => {
        return sanitize(line)
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/`(.*?)`/g, '<code>$1</code>');
      };

      for (const line of lines) {
        const trimmedLine = line.trim();
        const isList = trimmedLine.startsWith('* ') || trimmedLine.startsWith('- ');

        if (inList && !isList && trimmedLine) {
          html += '</ul>';
          inList = false;
        }

        if (trimmedLine.startsWith('# ')) {
          html += `<h1>${processInline(trimmedLine.substring(2))}</h1>`;
        } else if (trimmedLine.startsWith('## ')) {
          html += `<h2>${processInline(trimmedLine.substring(3))}</h2>`;
        } else if (trimmedLine.startsWith('### ')) {
          html += `<h3>${processInline(trimmedLine.substring(4))}</h3>`;
        } else if (isList) {
          if (!inList) {
            html += '<ul>';
            inList = true;
          }
          html += `<li>${processInline(trimmedLine.substring(2))}</li>`;
        } else if (trimmedLine) {
          html += `<p>${processInline(line)}</p>`;
        }
      }
      if (inList) html += '</ul>';
      return html;
    }

    const contentHtml = convertMarkdown(remarkText);

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <style>
                        #${popupId} .remark-content h1, #${popupId} .remark-content h2, #${popupId} .remark-content h3 { margin: 12px 0 6px 0; padding-bottom: 6px; border-bottom: 1px solid #e0c9a6; }
                        #${popupId} .remark-content h1 { font-size: 1.4em; color: #6a4226; }
                        #${popupId} .remark-content h2 { font-size: 1.2em; color: #7a5235; }
                        #${popupId} .remark-content h3 { font-size: 1.1em; color: #7a5235; }
                        #${popupId} .remark-content p { margin: 0 0 10px 0; }
                        #${popupId} .remark-content ul { margin: 10px 0; padding-left: 25px; }
                        #${popupId} .remark-content li { margin-bottom: 5px; }
                        #${popupId} .remark-content code { background-color: #e0d8cd; padding: 2px 5px; border-radius: 4px; font-family: monospace; color: #3a2c2c; font-size: 0.9em; }
                    </style>
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">导入备注</h4>
                    <div class="remark-content" style="flex: 1; min-height: 200px; overflow-y: auto; margin: 15px 0; background-color: #fdfaf5; border: 1px solid #f0e2d0; border-radius: 8px; padding: 15px; line-height: 1.6; word-wrap: break-word;">
                        ${contentHtml}
                    </div>
                    <div style="text-align: right;">
                        <button id="remark-popup-continue" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">继续导入</button>
                    </div>
                </div>
            </div>
        `;

    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#remark-popup-continue').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(true);
    });
  });
}

export function showNewEntriesPopup(newEntries: any[], promptIdToNameMap: Map<string, string>): Promise<any[] | null> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-new-entries-popup';
    $(`#${popupId}`).remove();

    const entriesHtml = newEntries
      .map((entry, index) => {
        const entryName = promptIdToNameMap.get(entry.id) || `未知条目 (ID: ${entry.id})`;
        const isChecked = entry.enabled ? 'checked' : '';
        const safeEntryName = $('<div/>').text(entryName).html();
        return `
                <div class="entry-item" style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #eee;">
                    <label for="new-entry-toggle-${index}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeEntryName}">${safeEntryName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" id="new-entry-toggle-${index}" data-id="${entry.id}" ${isChecked}/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
      })
      .join('');

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh; box-sizing: border-box;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">检测到新条目</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 10px 0; flex-shrink: 0;">请选择以下新增条目的默认启用状态(勾选为需要启用)：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${entriesHtml}
                    </div>
                    <div class="button-container" style="text-align: right; margin-top: auto; flex-shrink: 0; display:flex; justify-content:flex-end;">
                        <button id="new-entries-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333; margin-right: 10px;">取消</button>
                        <button id="new-entries-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认</button>
                    </div>
                </div>
            </div>
        `;

    $('body').append(popupHtml);

    const mobileStyles = `<style>@media (max-width: 600px) {#${popupId} { align-items: flex-start !important; } #${popupId} > div{ margin-top: 5vh; width: 95% !important;max-width: none !important;height: auto !important;max-height: 85vh !important;border-radius: 12px !important;padding: 15px !important;}#${popupId} h4{font-size: 18px !important;margin-bottom: 10px !important;}#${popupId} p{font-size: 14px !important;margin: 5px 0 15px 0 !important;}#${popupId} .entry-item{padding: 10px 0 !important;}#${popupId} .button-container{flex-direction: row !important;gap: 10px !important;justify-content: flex-end;}#${popupId} .button-container button{width: auto !important;margin: 0 !important;flex-grow: 1;}}</style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#new-entries-confirm').on('click', () => {
      const updatedEntries = newEntries.map((entry, index) => ({
        ...entry,
        enabled: $(`#new-entry-toggle-${index}`).is(':checked'),
      }));
      $(`#${popupId}`).remove();
      resolve(updatedEntries);
    });

    $('#new-entries-cancel').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(null);
    });
  });
}

export function showConfigSelectionPopup(configs: ConfigData[], charName: string): Promise<string | null> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-config-selection-popup';
    $(`#${popupId}`).remove();

    const configsHtml = configs
      .map((config, index) => {
        const safeName = $('<div/>').text(config.name).html();
        return `
                <div class="config-item" style="padding: 10px 5px; border-bottom: 1px solid #eee; cursor: pointer; border-radius: 4px; display: flex; align-items: center;">
                    <input type="radio" id="config-select-${index}" name="config-selection" value="${config.id}" style="margin-right: 10px; transform: scale(1.2);">
                    <label for="config-select-${index}" style="cursor: pointer; width: 100%;">${safeName}</label>
                </div>
            `;
      })
      .join('');

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 400px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 90vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">选择配置</h4>
                    <p style="font-size: 14px; color: #6a4226; margin: 15px 0; text-align: center;">角色 "${$('<div/>').text(charName).html()}" 绑定了多个配置，请选择一个进行加载：</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; padding: 5px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="config-select-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="config-select-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">加载</button>
                    </div>
                </div>
            </div>
        `;

    $('body').append(popupHtml);
    const mobileStyles = `<style> @media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; max-height: 85vh !important; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);

    if (configs.length > 0) $(`#config-select-0`).prop('checked', true);

    $(`#${popupId} .config-item`).on('click', function () {
      $(this).find('input[type="radio"]').prop('checked', true);
    });

    $('#config-select-confirm').on('click', () => {
      const selectedId = $('input[name="config-selection"]:checked').val() as string;
      if (selectedId) {
        $(`#${popupId}`).remove();
        resolve(selectedId);
      } else {
        toastr.warning('请选择一个配置。');
      }
    });

    $('#config-select-cancel').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(null);
    });
  });
}

export function showRegexExportSelectionPopup(boundRegexes: any[]): Promise<any[] | null> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-regex-export-popup';
    $(`#${popupId}`).remove();

    const regexesHtml = boundRegexes
      .map(regex => {
        const safeName = $('<div/>').text(regex.script_name).html();
        return `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <label for="regex-export-toggle-${regex.id}" style="cursor: pointer; flex: 1; margin-right: 10px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                    <label class="pm-switch">
                       <input type="checkbox" class="regex-export-checkbox" id="regex-export-toggle-${regex.id}" data-id="${regex.id}" checked/>
                       <span class="pm-slider"></span>
                    </label>
                </div>
            `;
      })
      .join('');

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导出的正则</h4>
                    <div style="margin: 10px 0; display: flex; justify-content: space-around;">
                       <button id="regex-export-select-all" style="padding: 6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; cursor:pointer;">全选</button>
                       <button id="regex-export-deselect-all" style="padding: 6px 12px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer;">全不选</button>
                    </div>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-export-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="regex-export-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">确认导出</button>
                    </div>
                </div>
            </div>
        `;

    $('body').append(popupHtml);
    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#regex-export-select-all').on('click', () => $('.regex-export-checkbox').prop('checked', true));
    $('#regex-export-deselect-all').on('click', () => $('.regex-export-checkbox').prop('checked', false));
    $('#regex-export-cancel').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(null);
    });
    $('#regex-export-confirm').on('click', () => {
      const selectedIds = new Set<string>();
      $('.regex-export-checkbox:checked').each(function () {
        selectedIds.add($(this).data('id'));
      });
      const selectedRegexes = boundRegexes.filter(r => selectedIds.has(r.id));
      $(`#${popupId}`).remove();
      resolve(selectedRegexes);
    });
  });
}

export function showRegexDeletionPopup(existingRegexes: any[]): Promise<any[]> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-regex-delete-popup';
    $(`#${popupId}`).remove();

    const regexesHtml = existingRegexes
      .map(regex => {
        const safeName = $('<div/>').text(regex.script_name).html();
        return `
                <div style="display: flex; align-items: center; padding: 10px 5px; border-bottom: 1px solid #eee;">
                    <input type="checkbox" class="regex-delete-checkbox" id="regex-delete-toggle-${regex.id}" data-id="${regex.id}" style="margin-right: 15px; transform: scale(1.3);">
                    <label for="regex-delete-toggle-${regex.id}" style="cursor: pointer; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${safeName}">${safeName}</label>
                </div>
            `;
      })
      .join('');

    const popupHtml = `
            <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 450px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#c62828; text-align: center;">删除已有正则 (可选)</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">在导入新正则前，你可以选择删除一些不再需要的旧正则。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${regexesHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="regex-delete-skip" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">跳过并导入</button>
                        <button id="regex-delete-confirm" style="padding: 8px 16px; background-color:#f5a8a0; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">删除选中并导入</button>
                    </div>
                </div>
            </div>
        `;
    $('body').append(popupHtml);

    const mobileStyles = `<style>@media (max-width: 600px) { #${popupId} { align-items: flex-start !important; } #${popupId} > div { margin-top: 5vh; } }</style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#regex-delete-skip').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(existingRegexes);
    });

    $('#regex-delete-confirm').on('click', () => {
      const idsToDelete = new Set<string>();
      $('.regex-delete-checkbox:checked').each(function () {
        idsToDelete.add($(this).data('id'));
      });

      const remainingRegexes = existingRegexes.filter(r => !idsToDelete.has(r.id));
      if (idsToDelete.size > 0) {
        toastr.info(`已删除 ${idsToDelete.size} 条旧正则。`);
      }
      $(`#${popupId}`).remove();
      resolve(remainingRegexes);
    });
  });
}

export function showBatchImportConfigSelectionPopup(configsToImport: ConfigData[]): Promise<any[] | null> {
  return new Promise(resolve => {
    const popupId = 'preset-manager-batch-import-popup';
    $(`#${popupId}`).remove();

    const configsHtml = configsToImport
      .map(config => {
        const safeName = $('<div/>').text(config.name).html();
        return `
                <div style="padding: 8px 5px; border-bottom: 1px solid #eee; display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" class="pm-batch-import-checkbox" data-original-id="${config.id}" checked style="transform: scale(1.2);">
                    <label style="font-weight: bold; flex-shrink: 0;" title="${safeName}">${safeName}</label>
                    <input type="text" class="pm-batch-import-newname" value="${safeName}" style="flex: 1; min-width: 100px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 4px 6px; border-radius: 4px; font-size:13px;">
                </div>
            `;
      })
      .join('');

    const popupHtml = `
             <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10001; display: flex; align-items: center; justify-content: center;">
                <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 500px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
                    <h4 style="margin-top:0; color:#6a4226; text-align: center;">选择要导入的配置</h4>
                    <p style="font-size: 13px; color: #777; text-align: center; margin-bottom: 15px;">勾选要导入的配置，可修改导入后的名称。</p>
                    <div style="flex: 1; min-height: 0; overflow-y: auto; margin-bottom: 20px; border-top: 1px solid #f0e2d0; border-bottom: 1px solid #f0e2d0; padding: 5px 10px;">
                        ${configsHtml}
                    </div>
                    <div style="text-align: right; display:flex; justify-content:flex-end; gap: 10px;">
                        <button id="batch-import-cancel" style="padding: 8px 16px; background-color:#e0e0e0; border:none; border-radius:6px; cursor:pointer; color:#333;">取消</button>
                        <button id="batch-import-confirm" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">导入选中项</button>
                    </div>
                </div>
            </div>
        `;
    $('body').append(popupHtml);

    const mobileStyles = `<style>
            @media (max-width: 600px) { #${popupId} > div { margin-top: 600px; } }
        </style>`;
    $(`#${popupId}`).append(mobileStyles);

    $('#batch-import-cancel').on('click', () => {
      $(`#${popupId}`).remove();
      resolve(null);
    });

    $('#batch-import-confirm').on('click', () => {
      const choices: any[] = [];
      let hasError = false;
      $('#preset-manager-batch-import-popup .pm-batch-import-checkbox').each(function () {
        const checkbox = $(this);
        const newName = checkbox.siblings('.pm-batch-import-newname').val()?.toString().trim();
        if (!newName && checkbox.is(':checked')) {
          toastr.error(`有已勾选的配置新名称为空。`);
          hasError = true;
          return false;
        }
        choices.push({
          originalId: checkbox.data('original-id'),
          newName: newName,
          import: checkbox.is(':checked'),
        });
      });

      if (!hasError) {
        $(`#${popupId}`).remove();
        resolve(choices);
      }
    });
  });
}

// 显示查看配置弹窗
export async function showViewConfigPopup(configId: string): Promise<void> {
  const { getStoredConfigs } = await import('./配置存储和读取');
  const configs = await getStoredConfigs();
  const configData = configs[configId];

  if (!configData) {
    toastr.error('配置不存在');
    return;
  }

  // 获取所有正则信息，用于显示名称
  let allRegexes: any[] = [];
  try {
    allRegexes = await TavernHelper.getTavernRegexes({ scope: 'global' });
  } catch (error) {
    console.warn('获取正则信息失败:', error);
  }

  const popupId = 'preset-manager-view-config-popup';
  $(`#${popupId}`).remove();

  // 统计配置信息
  const totalStates = configData.states.length;
  const enabledStates = configData.states.filter((state: any) => state.enabled).length;
  const disabledStates = totalStates - enabledStates;

  // 分组显示状态
  const enabledStatesHtml = configData.states
    .filter((state: any) => state.enabled)
    .map(
      (state: any) =>
        `<div style="padding: 4px 8px; margin: 2px; background-color: #e8f5e8; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`,
    )
    .join('');

  const disabledStatesHtml = configData.states
    .filter((state: any) => !state.enabled)
    .map(
      (state: any) =>
        `<div style="padding: 4px 8px; margin: 2px; background-color: #ffebee; border-radius: 4px; font-size: 12px;">${$('<div/>').text(state.name).html()}</div>`,
    )
    .join('');

  // 正则绑定信息
  const regexInfo =
    configData.regexStates && configData.regexStates.length > 0
      ? `<div style="margin-top: 15px;">
         <h5 style="color: #6a4226; margin-bottom: 8px;">绑定正则 (${configData.regexStates.length}个)</h5>
         <div class="item-list" style="max-height: 100px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
           ${configData.regexStates
             .map((regex: any) => {
               // 从所有正则中查找对应的正则信息
               const fullRegexInfo = allRegexes.find(r => r.id === regex.id);
               const regexName =
                 fullRegexInfo?.script_name ||
                 fullRegexInfo?.scriptName ||
                 regex.scriptName ||
                 regex.script_name ||
                 regex.name ||
                 `正则ID: ${regex.id}`;
               return `<div style="padding: 4px 8px; margin: 2px; background-color: ${regex.enabled ? '#e3f2fd' : '#fafafa'}; border-radius: 4px; font-size: 12px;">
                ${$('<div/>').text(regexName).html()} ${regex.enabled ? '(启用)' : '(禁用)'}
              </div>`;
             })
             .join('')}
         </div>
       </div>`
      : '';

  const popupHtml = `
    <div id="${popupId}" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 10002; display: flex; align-items: center; justify-content: center;">
      <div style="background-color: #fff8f0; color: #3a2c2c; border-radius: 16px; padding: 20px; width: 90%; max-width: 600px; box-shadow: 0 4px 25px rgba(120,90,60,.25); display: flex; flex-direction: column; max-height: 80vh;">
        <h4 style="margin-top:0; color:#6a4226; text-align: center; border-bottom: 2px solid #f0d8b6; padding-bottom: 10px;">查看配置详情</h4>
        
        <div style="flex: 1; min-height: 0; overflow-y: auto; margin: 15px 0;">
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">基本信息</h5>
            <div style="background-color: #f9f3ea; padding: 10px; border-radius: 6px;">
              <div><strong>配置名称:</strong> ${$('<div/>').text(configData.name).html()}</div>
              <div><strong>关联预设:</strong> ${$('<div/>').text(configData.presetName).html()}</div>
              <div><strong>创建时间:</strong> ${new Date(configData.id).toLocaleString()}</div>
              ${configData.boundCharName ? `<div><strong>绑定角色:</strong> <span style="color: #4CAF50;">${$('<div/>').text(configData.boundCharName).html()}</span></div>` : ''}
            </div>
          </div>

          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">条目状态统计</h5>
            <div class="stats-container" style="display: flex; gap: 10px; margin-bottom: 10px;">
              <div class="stats-item" style="background-color: #e8f5e8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #2e7d32;">启用</div>
                <div style="font-size: 18px; font-weight: bold;">${enabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #ffebee; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #c62828;">禁用</div>
                <div style="font-size: 18px; font-weight: bold;">${disabledStates}</div>
              </div>
              <div class="stats-item" style="background-color: #f0f4f8; padding: 8px; border-radius: 6px; flex: 1; text-align: center;">
                <div style="font-weight: bold; color: #546e7a;">总计</div>
                <div style="font-size: 18px; font-weight: bold;">${totalStates}</div>
              </div>
            </div>
          </div>

          ${
            enabledStates > 0
              ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">启用的条目 (${enabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${enabledStatesHtml}
            </div>
          </div>
          `
              : ''
          }

          ${
            disabledStates > 0
              ? `
          <div style="margin-bottom: 15px;">
            <h5 style="color: #6a4226; margin-bottom: 8px;">禁用的条目 (${disabledStates}个)</h5>
            <div class="item-list" style="max-height: 150px; overflow-y: auto; border: 1px solid #e0c9a6; border-radius: 4px; padding: 8px;">
              ${disabledStatesHtml}
            </div>
          </div>
          `
              : ''
          }

          ${regexInfo}
        </div>

        <div style="text-align: right; margin-top: 15px; display: flex; gap: 10px; justify-content: flex-end;">
          <button id="view-config-load" data-id="${configId}" style="padding: 8px 16px; background-color:#4CAF50; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#fff;">加载此配置</button>
          <button id="view-config-close" style="padding: 8px 16px; background-color:#f4c78e; border:none; border-radius:6px; cursor:pointer; font-weight:bold; color:#3a2c2c;">关闭</button>
        </div>
      </div>
    </div>
  `;

  $('body').append(popupHtml);

  // 绑定事件
  $('#view-config-close').on('click', () => {
    $(`#${popupId}`).remove();
  });

  $('#view-config-load').on('click', async () => {
    const configId = $('#view-config-load').data('id');
    $(`#${popupId}`).remove();
    const { loadConfig } = await import('./配置操作功能');
    await loadConfig(configId);
  });

  // 移动端样式
  const mobileStyles = `<style>
    @media (max-width: 600px) { 
      #${popupId} { 
        align-items: flex-start !important; 
        padding: 10px;
      } 
      #${popupId} > div { 
        margin-top: 5vh; 
        max-height: 90vh !important; 
        width: 95% !important;
        padding: 15px;
        border-radius: 12px;
      }
      #${popupId} h4 {
        font-size: 18px !important;
        margin-bottom: 15px !important;
      }
      #${popupId} h5 {
        font-size: 15px !important;
        margin-bottom: 10px !important;
      }
      #${popupId} button {
        font-size: 14px !important;
        padding: 10px 16px !important;
        min-height: 44px;
      }
      #${popupId} .stats-container {
        flex-direction: column !important;
        gap: 8px !important;
      }
      #${popupId} .stats-item {
        flex: none !important;
        padding: 12px !important;
      }
      #${popupId} .item-list {
        max-height: 120px !important;
        font-size: 13px !important;
      }
      #${popupId} .item-list div {
        padding: 6px 10px !important;
        margin: 3px !important;
        font-size: 12px !important;
      }
    }
    @media (max-width: 480px) {
      #${popupId} > div {
        margin-top: 2vh !important;
        max-height: 96vh !important;
        padding: 12px;
      }
      #${popupId} h4 {
        font-size: 16px !important;
      }
      #${popupId} .stats-item {
        padding: 10px !important;
      }
      #${popupId} .stats-item div:first-child {
        font-size: 13px !important;
      }
      #${popupId} .stats-item div:last-child {
        font-size: 16px !important;
      }
    }
  </style>`;
  $(`#${popupId}`).append(mobileStyles);
}
