import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Liquid Router Manager" },
    { name: "description", content: "Liquid Router Manager gives you full control over your Liquid router." },
  ];
}

export default function Home() {
  return <Welcome />;
}
