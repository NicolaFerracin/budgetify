const scripts = {
    init: function() {
        this.setUpSidebar();
    },
    setUpSidebar: () => {
        window.addEventListener('load', () => {
            const sidebar = document.getElementsByClassName('sidebar-menu')[0];
            if (sidebar) {
                sidebar.tree();
            }
        }, false);
    }
}

export default scripts;