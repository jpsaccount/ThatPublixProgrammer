import { useNavigate } from "@tanstack/react-router";

export default function usePolNavigate() {
  const navigate = useNavigate();

  // function transitionNavigate(
  //   to: string,
  //   options?: { replace?: boolean; state?: any }
  // ) {
  //   navigate(to);
  // }

  return navigate;
}
