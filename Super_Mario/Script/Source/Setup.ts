namespace Script {
    window.addEventListener("load", init);

    let dialog: HTMLDialogElement;
    function init(_event: Event): void {
        dialog = document.querySelector("dialog");
        dialog.querySelector("h1").textContent = document.title;
        dialog.addEventListener("click", function (_event: Event): void {
            // @ts-ignore until HTMLDialog is implemented by all browsers and available in dom.d.ts
            dialog.close();
            startInteractiveViewport();
        });
        //@ts-ignore
        dialog.showModal();
    }


    async function startInteractiveViewport(): Promise<void> {
        await ƒ.Project.loadResourcesFromHTML();
        ƒ.Debug.log("Project:", ƒ.Project.resources);
        let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.resources["Graph|2022-05-24T17:31:01.983Z|19489"];
        ƒ.Debug.log("Graph:", graph);
        if (!graph) {
            alert(
                "Nothing to render. Create a graph with at least a mesh, material and probably some light"
            );
            return;
        }
        let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
        let canvas: HTMLCanvasElement = document.querySelector("canvas");
        let viewport: ƒ.Viewport = new ƒ.Viewport();
        viewport.initialize("InteractiveViewport", graph, cmpCamera, canvas);
        ƒ.Debug.log("Viewport:", viewport);


        viewport.draw();
        canvas.dispatchEvent(
            new CustomEvent("interactiveViewportStarted", {
                bubbles: true,
                detail: viewport
            })
        );
    }
}