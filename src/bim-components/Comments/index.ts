import * as OBC from "@thatopen/components"
import * as OBF from "@thatopen/components-front"
import * as THREE from "three"
import { Comment } from "./src"

export class Comments extends OBC.Component {
  static uuid = "f7bc0bb9-fd64-4cef-9771-ee91a5cccbba" as const
  private _enabled = false
  set enabled(value: boolean) {
    this._enabled = value
    if (!value && this._previewElement) {
      this._previewElement.visible = false
    }
  }

  get enabled() {
    return this._enabled
  }

  readonly list: Comment[] = []

  private _world: OBC.World | null = null

  readonly onCommnetAdded = new OBC.Event<Comment>

  set world(world: OBC.World | null) {
    this._world = world
    if (world) {
      this.createPreviewElement(world)
      this.setEvents(world, true)
    }
  }

  get world() {
    return this._world
  }

  constructor(components: OBC.Components) {
    super(components)
    components.add(Comments.uuid, this)
  }

  addComment(text: string, position?: THREE.Vector3) {
    const comment = new Comment(text)
    comment.position = position
    this.list.push(comment)
    this.onCommnetAdded.trigger(comment)
    return comment
  }

  private _previewElement: OBF.Mark | null = null

  private createPreviewElement = (world: OBC.World) => {
    const icon = document.createElement("bim-label")
    icon.textContent = "Add Comment"
    icon.icon = "material-symbols:comment"
    icon.style.backgroundColor = "var(--bim-ui_bg-base)"
    icon.style.padding = "0.5rem"
    icon.style.borderRadius = "0.5rem"
    const preview = new OBF.Mark(world, icon)
    preview.visible = false
    this._previewElement = preview
  }

  private addCommentOnPreviewPoint = () => {
    if (!(this.enabled && this._hitPoint)) return;
    const text = prompt("Comment")
    if (!(text && text.trim() !== "")) return;
    this.addComment(text, this._hitPoint)
  }

  private _hitPoint: THREE.Vector3 | null = null

  checkHitPoint = () => {
    if (!(this.enabled && this.world && this._previewElement)) { return }
    const raycasters = this.components.get(OBC.Raycasters)
    const raycaster = raycasters.get(this.world)
    const result = raycaster.castRay()
    if (result) {
      this._previewElement.visible = true
      this._previewElement.three.position.copy(result.point)
      this._hitPoint = result.point
    } else {
      this._previewElement.visible = false
      this._hitPoint = null
    }
  }

  private setEvents(world: OBC.World, enabled: boolean) {
    if (!(world.renderer && world.renderer.three.domElement.parentElement)) {
      throw new Error("Comments: your world needs a renderer!")
    }
    const worldContainer = world.renderer.three.domElement.parentElement
    if (enabled) {
      worldContainer.addEventListener("mousemove", this.checkHitPoint)
      worldContainer.addEventListener("click", this.addCommentOnPreviewPoint)
    } else {
      worldContainer.removeEventListener("mousemove", this.checkHitPoint)
      worldContainer.removeEventListener("click", this.addCommentOnPreviewPoint)
    }
  }

}