let threshold = 600;
let legend = true;

document.addEventListener('DOMContentLoaded', async function() {
    // Make sure we have plots to render
    if (!window.plotlyPlots || !window.plotlyPlots.length) return;

    const shouldHaveLegend = window.innerWidth >= threshold;

    async function renderPlot(plotConfig) {
        try {
            const element = document.getElementById(plotConfig.id);
            if (!element) return;

            // Render the plot
            const plotly_json = JSON.parse(plotConfig.data);
            const config = {
                responsive: true,
                modeBarButtonsToRemove: ["select2d", "lasso2d", "toggleSpikelines",
                    "toggleHover", "hoverCompareCartesian", "hoverClosestCartesian",
                    "resetCameraLastSave3d", "hoverClosest3d"
                ],
            };
            plotly_json.layout.showlegend = shouldHaveLegend && plotConfig.showlegend;
            await Plotly.newPlot(plotConfig.id, plotly_json.data, plotly_json.layout, config);
            plotConfig.data = null;  // Clear data to save memory

        } catch (error) {
            console.error(`Failed to render plot ${plotConfig.id}:`, error);
            const element = document.getElementById(plotConfig.id);
            if (element) {
                element.innerText = 'Failed to load plot';
            }
        }
    }

    // Render plots sequentially with a small delay between each
    for (const plot of window.plotlyPlots) {
        await renderPlot(plot);
        // Add a small delay between plots to prevent overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 66));
    }
});

async function adjustLegendVisibility() {
    if (!window.plotlyPlots || !window.plotlyPlots.length) return;

    if (window.innerWidth < threshold && legend) {
        for (const plot of window.plotlyPlots) {
            const element = document.getElementById(plot.id);
            if (element) {
                await Plotly.relayout(element, {showlegend: false});
                await new Promise(resolve => setTimeout(resolve, 33));
            }
        }
        legend = false;
    } else if (window.innerWidth >= threshold && !legend) {
        for (const plot of window.plotlyPlots) {
            const element = document.getElementById(plot.id);
            if (element && plot.showlegend) {
                await Plotly.relayout(element, {showlegend: true});
                await new Promise(resolve => setTimeout(resolve, 33));
            }
        }
        legend = true;
    }

}

// Add a resize event listener to handle legend visibility - no legend on mobile
window.addEventListener('resize', adjustLegendVisibility);