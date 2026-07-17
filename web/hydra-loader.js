<!-- 
  TechStora HydraJS Core Engine v1.0.9 (Zero-Cache Live Development Build)
  Architecture Pattern: Headless DOM Ingestion Engine
  Purpose: Real-time Hybridization via Bypassing CDN Edge Buffer
-->
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
    const targetUrl = 'https://cdn.jsdelivr.net/gh/techstoraa/public-assets@main/web/tools/xxxxx';

    try {
        const response = await fetch(targetUrl, { cache: 'default' });
        if (!response.ok) throw new Error('HTTP_' + response.status);
        const rawHtml = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        const styles = doc.querySelectorAll('style');
        styles.forEach(st => document.head.appendChild(st.cloneNode(true)));

        const bodyContent = doc.querySelector('.ts-master-wrapper');
        const root = document.getElementById('ts-workspace-root');

        if (bodyContent) {
            root.innerHTML = '';
            root.appendChild(bodyContent.cloneNode(true));
        }

        const inlineScript = doc.querySelector('script');
        if (inlineScript) {
            const cleanJS = inlineScript.textContent.replace(/window\.parent\.document/g, 'window.document');
            const executionThread = document.createElement('script');
            executionThread.type = 'text/javascript';
            executionThread.textContent = cleanJS;
            document.body.appendChild(executionThread);
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
