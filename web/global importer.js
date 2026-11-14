<div id="ts-workspace-root">
  <div id="ts-loader-placeholder" style="min-height: 420px; display: flex; align-items: center; justify-content: center; gap: 12px; background: #0a0e27; color: #00d9ff; font-size: 15px; border-radius: 8px;">
    <div style="width: 22px; height: 22px; border: 3px solid rgba(0,217,255,0.2); border-top-color: #00d9ff; border-radius: 50%; animation: ts-loader-spin 0.8s linear infinite;"></div>
    <span>Loading tool...</span>
  </div>
</div>
<style>
@keyframes ts-loader-spin { to { transform: rotate(360deg); } }
</style>

<script type="text/javascript">
(async function() {
    const targetUrl = "xxxxxxxxxxx";
    const root = document.getElementById('ts-workspace-root');

    const dumpRawError = (err, context = "Loader Runtime Error") => {
        console.error("TechStora Core Runtime Hybridization Failed:", err);
        if (!root) return;

        const rawDump = [
            `[CONTEXT]: ${context}`,
            `[TARGET_URL]: ${targetUrl}`,
            `[NAME]: ${err && err.name ? err.name : 'UnknownError'}`,
            `[MESSAGE]: ${err && err.message ? err.message : String(err)}`,
            `[STACK]:\n${err && err.stack ? err.stack : 'No stack trace available'}`
        ].join('\n\n');

        root.innerHTML = '';
        const box = document.createElement('div');
        box.style.cssText = 'min-height:420px; padding:24px; background:#0a0e27; border:1px solid #ff4a4a; border-radius:8px; color:#ff4a4a; text-align:left; overflow-x:auto;';

        const title = document.createElement('div');
        title.style.cssText = 'font-size:20px; font-weight:700; margin-bottom:14px; color:#ff4a4a;';
        title.textContent = 'RAW ERROR DUMP (TechStora Importer)';

        const pre = document.createElement('pre');
        pre.style.cssText = 'margin:0; white-space:pre-wrap; word-break:break-word; font-size:15px; line-height:1.6; color:#f5f5f5; background:#0f142e; padding:16px; border:1px solid #23294c; border-radius:6px;';
        pre.textContent = rawDump;

        box.appendChild(title);
        box.appendChild(pre);
        root.appendChild(box);
    };

    try {
        const response = await fetch(targetUrl, { cache: 'default' });
        if (!response.ok) {
            const bodyPreview = await response.text().catch(() => '');
            throw new Error(`HTTP_${response.status} (${response.statusText})\nResponse Body:\n${bodyPreview.slice(0, 600)}`);
        }
        const rawHtml = await response.text();

        const parser = new DOMParser();
        const doc = parser.parseFromString(rawHtml, 'text/html');

        doc.querySelectorAll('style').forEach(st => {
            document.head.appendChild(st.cloneNode(true));
        });

        doc.querySelectorAll('link[rel="stylesheet"]').forEach(link => {
            document.head.appendChild(link.cloneNode(true));
        });

        root.innerHTML = '';
        const bodyClone = doc.body.cloneNode(true);

        const scriptTags = Array.from(bodyClone.querySelectorAll('script'));
        scriptTags.forEach(s => s.remove());

        const innerRoot = bodyClone.querySelector('#ts-workspace-root');
        const sourceContainer = innerRoot || bodyClone;

        while (sourceContainer.firstChild) {
            root.appendChild(sourceContainer.firstChild);
        }

        const originalScripts = Array.from(doc.querySelectorAll('script'));

        for (const scr of originalScripts) {
            await new Promise((resolve, reject) => {
                const execTag = document.createElement('script');

                if (scr.src) {
                    execTag.src = scr.src;
                    execTag.onload = resolve;
                    execTag.onerror = () => reject(new Error('SCRIPT_LOAD_FAIL: ' + scr.src));
                    document.body.appendChild(execTag);
                } else {
                    try {
                        const cleanJS = scr.textContent
                            .replace(/window\.parent\.document/g, 'window.document');
                        execTag.textContent = cleanJS;
                        document.body.appendChild(execTag);
                        resolve();
                    } catch (inlineErr) {
                        reject(inlineErr);
                    }
                }
            });
        }

    } catch (err) {
        dumpRawError(err, "Fetch / Parse / Script Execution Failure");
    }
})();
</script>
