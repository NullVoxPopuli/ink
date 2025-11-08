import { renderComponent } from "@ember/renderer";
import type { ComponentLike } from "@glint/template";

export function render(component: ComponentLike, options = {}) {
	return renderComponent(component, { into: document.body, ...options });
}
