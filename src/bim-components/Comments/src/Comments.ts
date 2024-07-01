

import * as THREE from "three"

export class Comment {
  text: string;
  position?: THREE.Vector3
  replies: string[];
  onReplyAdded: ((reply: string) => void) | null;

  constructor(text: string) {
    this.text = text;
    this.replies = [];
    this.onReplyAdded = null; // Inicialmente no tiene ningún listener
  }

  // Método para añadir una respuesta al comentario
  addReply(reply: string) {
    if (reply.trim() !== '') { // Verifica que la respuesta no esté vacía
      this.replies.push(reply);

      // Verifica si hay un listener asignado a onReplyAdded y lo llama con la respuesta
      if (this.onReplyAdded) {
        this.onReplyAdded(reply);
      }
    }
  }
}