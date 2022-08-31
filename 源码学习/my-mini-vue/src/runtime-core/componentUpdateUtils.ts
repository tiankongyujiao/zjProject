export function shouldUpdateComponent(prevVNode: any, nextVNode: any) {
  const { props: preProps } = prevVNode;
  const { props: nextProps } = nextVNode;
  for (let key in nextProps) {
    if (nextProps[key] !== preProps[key]) {
      return true;
    }
  }
  return false;
}
