
import { createPortal } from "react-dom";

export function ButtonPortal({ children }) {
 const mountNode = document.getElementById("portal-root");
  if(!mountNode) return null;
 
  if(!mountNode) return null;

  return createPortal(children, mountNode)
}