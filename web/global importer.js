<div id="ts-workspace-root">
  <div id="ts-loader-placeholder" style="min-height: 420px; display: flex; align-items: center; justify-content: center; gap: 12px; background: #0a0e27; color: #00d9ff; font-family: 'Segoe UI', 'Inter', system-ui, sans-serif; font-size: 15px; border-radius: 12px;">
    <div style="width: 22px; height: 22px; border: 3px solid rgba(0,217,255,0.2); border-top-color: #00d9ff; border-radius: 50%; animation: ts-loader-spin 0.8s linear infinite;"></div>
    <span>Loading tool...</span>
  </div>
</div>
<style>
@keyframes ts-loader-spin { to { transform: rotate(360deg); } }
</style>

<script type="text/javascript">
(async function() {
    const targetUrl = "xxxxxxxx";

    try {
        const response = await fetch(targetUrl, { cache: 'default' });
        if (!response.ok) throw new Error('HTTP_' + response.status);
        const rawHtml = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        doc.querySelectorAll('style').forEach(st => {
            document.head.appendChild(st.cloneNode(true));
        });

        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            document.head.appendChild(link.cloneNode(true));
        });

        const root = document.getElementById('ts-workspace-root');
        root.innerHTML = '';
        const bodyClone = doc.body.cloneNode(true);

        const scriptTags = Array.from(bodyClone.querySelectorAll('script'));
        scriptTags.forEach(s => s.remove());

        while (bodyClone.firstChild) {
            root.appendChild(bodyClone.firstChild);
        }

        const originalScripts = Array.from(doc.querySelectorAll('script'));

        for (const scr of originalScripts) {
            await new Promise((resolve, reject) => {
                const execTag = document.createElement('script');

                if (scr.src) {
                    execTag.src = scr.src;
                    execTag.onload = resolve;
                    execTag.onerror = () => reject(new Error('SCRIPT_LOAD_FAIL: ' + scr.src));
                } else {
                    const cleanJS = scr.textContent
                        .replace(/window\.parent\.document/g, 'window.document');
                    execTag.textContent = cleanJS;
                    document.body.appendChild(execTag);
                    resolve();
                    return;
                }

                document.body.appendChild(execTag);
            });
        }

    } catch (err) {
        console.error("TechStora Core Runtime Hybridization Failed:", err);
        const root = document.getElementById('ts-workspace-root');
        if (root) {
            root.innerHTML = '<div style="min-height:420px; display:flex; align-items:center; justify-content:center; color:#f87171; background:#0a0e27; border-radius:12px; font-family:Segoe UI, Inter, system-ui, sans-serif; font-size:14px;">Failed to load tool. Please refresh.</div>';
        }
    }
})();
</script>
