// 配置列表的按钮事件绑定
export function bindConfigListEvents(): void {
  const listElement = $('#preset-manager-list');
  console.log('绑定配置列表事件，找到按钮数量:', listElement.find('button').length);

  listElement.off('click', 'button').on('click', 'button', async function (e) {
    const button = $(this);
    const action = button.attr('name');
    console.log('按钮点击事件触发，action:', action, 'configId:', button.data('id'));

    if (action === 'more-actions') {
      e.stopPropagation();
      const submenu = button.siblings('.pm-submenu');
      $('.pm-submenu').not(submenu).hide(); // Hide other open menus
      submenu.toggle();
      return;
    }

    if (action === 'close-submenu') {
      button.closest('.pm-submenu').hide();
      return;
    }

    const configId = button.data('id');

    // 动态导入避免循环引用
    switch (action) {
      case 'rename-config': {
        const { renameConfig } = await import('./配置操作功能');
        await renameConfig(configId);
        break;
      }
      case 'update-config': {
        const { updateConfig } = await import('./配置操作功能');
        await updateConfig(configId);
        break;
      }
      case 'load-config': {
        const { loadConfig } = await import('./配置操作功能');
        await loadConfig(configId);
        break;
      }
      case 'export-config': {
        const { exportConfig } = await import('./导入导出功能');
        await exportConfig(configId);
        break;
      }
      case 'delete-config': {
        const { deleteConfig } = await import('./配置操作功能');
        await deleteConfig(configId);
        break;
      }
      case 'bind-regex': {
        const { showRegexBindingPopup } = await import('./正则绑定功能');
        await showRegexBindingPopup(configId);
        break;
      }
      case 'view-config': {
        const { showViewConfigPopup } = await import('./辅助弹窗功能');
        await showViewConfigPopup(configId);
        break;
      }
    }

    button.closest('.pm-submenu').hide();
  });
}
