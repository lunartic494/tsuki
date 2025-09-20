import { TIPS, UI_ID } from './初始化和配置';
import { handleFileImport } from './导入导出功能';
import { showBatchDeletePopup, showBatchExportPopup } from './批量操作功能';
import { showPromptGroupingUI } from './条目分组功能';
import { showHelpPopup } from './辅助弹窗功能';
import { renderConfigsList } from './配置存储和读取';
import { saveCurrentConfig } from './配置操作功能';

export function createUI(): void {
  if ($(`#${UI_ID}`).length > 0) return;

  const uiContainer = $(`
        <div id="${UI_ID}">
            <style>
                #${UI_ID}{display:none;position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:10000;background-color:#fff8f0;color:#3a2c2c;border:1px solid #e0c9a6;border-radius:16px;padding:20px;box-shadow:0 4px 25px rgba(120,90,60,.25);width:90%;max-width:550px;max-height:80vh;font-family:'Segoe UI',sans-serif;display:flex;flex-direction:column}#${UI_ID} h4{margin-top:0;border-bottom:2px solid #f0d8b6;padding-bottom:10px;color:#6a4226}#${UI_ID} h5{margin:8px 0;color:#7a5235}#${UI_ID} button{transition:all .2s ease}#${UI_ID} button:hover{opacity:.85}#${UI_ID} #preset-manager-list-section{flex:1;overflow-y:auto}@media (max-width:600px){#${UI_ID}{top:0;left:0;transform:none;width:100%;height:100vh;max-width:none;max-height:none;border-radius:0;padding:10px;box-shadow:none;display:flex;flex-direction:column}#${UI_ID} h4{font-size:18px;text-align:center;padding:12px 0;margin:0;border-bottom:2px solid #f0d8b6}#${UI_ID} #preset-manager-close{top:10px;right:10px;font-size:28px}#${UI_ID} #preset-manager-save-section{flex-wrap:wrap}#${UI_ID} #preset-manager-name-input{width:100%;margin-left:0;margin-bottom:10px}}
                .pm-switch{position:relative;display:inline-block;width:40px;height:20px;flex-shrink:0}.pm-switch input{opacity:0;width:0;height:0}.pm-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.4s;border-radius:20px}.pm-slider:before{position:absolute;content:"";height:16px;width:16px;left:2px;bottom:2px;background-color:#fff;transition:.4s;border-radius:50%}input:checked+.pm-slider{background-color:#4CAF50}input:checked+.pm-slider:before{transform:translateX(20px)}
                #preset-manager-tips-section { margin-top: 15px; padding: 10px; background-color: #f9f3ea; border-radius: 8px; font-size: 12px; color: #7a5235; text-align: center; flex-shrink: 0; }
                .pm-config-group summary { cursor: pointer; padding: 8px; background-color: #f7f0e4; border-radius: 6px; margin-top: 5px; font-weight: bold; } .pm-config-group summary:hover { background-color: #f0e2d0; } .pm-config-count { color: #888; font-weight: normal; margin-left: 5px; } .pm-config-sublist { list-style: none; padding-left: 15px; border-left: 2px solid #f0e2d0; margin-left: 8px; }
                .pm-actions-container { display: flex; align-items: center; gap: 5px; justify-content: flex-end; }
                .pm-actions-container > button, .pm-more-btn-wrapper > button { flex-shrink: 0; padding: 6px 12px; font-size: 13px; font-weight: 500; border-radius: 6px; cursor: pointer; border: none; }
                .pm-more-btn-wrapper { position: relative; }
                .pm-submenu { display: none; position: absolute; right: 0; top: calc(100% + 5px); background-color: #fff; border: 1px solid #e0c9a6; border-radius: 8px; box-shadow: 0 3px 15px rgba(120,90,60,.15); z-index: 10003; padding: 5px; min-width: 100px; }
                .pm-submenu button { display: block; width: 100%; text-align: left; padding: 8px 12px; border: none; background: none; font-size: 13px; border-radius: 4px; color: #3a2c2c; cursor: pointer; }
                .pm-submenu button:hover { background-color: #f0e2d0; }
            </style>

            <h4>喵喵预设配置管理by小n</h4>
            <button id="preset-manager-close" style="position:absolute; top:12px; right:16px; background:none; border:none; color:#9a6b4f; font-size:24px; cursor:pointer;">&times;</button>
            
            <div id="preset-manager-save-section" style="margin-bottom: 20px; margin-top:15px;">
                <div style="display:flex; flex-wrap: wrap; align-items:center;">
                    <label for="preset-manager-name-input" style="font-weight:bold; flex-shrink:0;">配置名称:</label>
                    <input type="text" id="preset-manager-name-input" placeholder="例如：仅破限" style="flex:1; min-width: 100px; margin-left: 10px; background-color: #fff; border: 1px solid #d4b58b; color:#3a2c2c; padding: 6px 8px; border-radius: 6px; font-size:14px;" />
                    <button id="preset-manager-save-btn" style="margin-left: 10px; padding:6px 12px; background-color:#f4c78e; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">保存</button>
                </div>
                <div style="margin-top: 10px; display:flex; align-items:center; padding-left: 5px;">
                   <label for="preset-manager-bind-char" style="cursor:pointer;">绑定到当前角色</label>
                   <label class="pm-switch" style="margin-left: auto;">
                      <input type="checkbox" id="preset-manager-bind-char"/>
                      <span class="pm-slider"></span>
                   </label>
                </div>
                <!-- 分割线 -->
                <hr style="margin: 15px 0; border: none; border-top: 1px solid #e0c9a6; opacity: 0.6;">
                <div style="display:flex; flex-wrap: wrap; gap: 10px; align-items:center;">
                    <button id="preset-manager-help-btn" style="padding:6px 12px; background-color:#bcaaa4; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">使用说明</button>
                    <button id="preset-manager-import-btn" style="padding:6px 12px; background-color:#a5d6f9; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">导入</button>
                    <button id="preset-manager-batch-export-btn" style="padding:6px 12px; background-color:#81c784; border:none; border-radius:6px; color:#3a2c2c; cursor:pointer; font-weight:bold;">批量导出</button>
                    <button id="preset-manager-batch-delete-btn" style="padding:6px 12px; background-color:#ef9a9a; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">批量删除</button>
                    <button id="preset-manager-grouping-btn" style="padding:6px 12px; background-color:#9c27b0; border:none; border-radius:6px; color:#fff; cursor:pointer; font-weight:bold;">条目分组</button>
                </div>
            </div>

            <div id="preset-manager-list-section">
                <h5>已保存的配置:</h5>
                <ul id="preset-manager-list" style="list-style:none; padding:0; margin:0;"></ul>
            </div>

            <div id="preset-manager-tips-section"></div>
        </div>
    `);
  $('body').append(uiContainer);
  $('body').append('<input type="file" id="preset-manager-import-file" accept=".json" style="display:none;">');

  $(`#${UI_ID}`).hide();

  // 绑定事件处理器
  bindUIEvents();
}

function bindUIEvents(): void {
  console.log('🔗 开始绑定UI事件...');

  $('#preset-manager-close').on('click', () => {
    console.log('🖱️ 关闭按钮被点击');
    toggleUI();
  });

  $('#preset-manager-help-btn').on('click', () => {
    console.log('🖱️ 帮助按钮被点击');
    showHelpPopup();
  });

  $('#preset-manager-save-btn').on('click', () => {
    console.log('🖱️ 保存按钮被点击');
    saveCurrentConfig();
  });

  $('#preset-manager-import-btn').on('click', () => {
    console.log('🖱️ 导入按钮被点击');
    $('#preset-manager-import-file').click();
  });

  $('#preset-manager-batch-export-btn').on('click', () => {
    console.log('🖱️ 批量导出按钮被点击');
    showBatchExportPopup();
  });

  $('#preset-manager-batch-delete-btn').on('click', () => {
    console.log('🖱️ 批量删除按钮被点击');
    showBatchDeletePopup();
  });

  $('#preset-manager-grouping-btn').on('click', () => {
    console.log('🖱️ 条目分组按钮被点击');
    showPromptGroupingUI();
  });

  $('#preset-manager-import-file').on('change', event => {
    console.log('🖱️ 文件选择发生变化');
    handleFileImport(event);
  });

  console.log('✅ UI事件绑定完成');
}

export function toggleUI(): void {
  const ui = $(`#${UI_ID}`);
  if (ui.is(':visible')) {
    ui.fadeOut();
  } else {
    renderConfigsList();
    const randomTip = TIPS[Math.floor(Math.random() * TIPS.length)];
    $('#preset-manager-tips-section').text('小贴士：' + randomTip);
    ui.fadeIn();
  }
}
