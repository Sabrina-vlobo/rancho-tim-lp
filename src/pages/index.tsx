import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { useRolagemSuave } from "@/components/RolagemSuave";
import { Usos } from "@/components/Usos";
import { Estrutura } from "@/components/Estrutura";
import { ComoReservar } from "@/components/ComoReservar";
import { Duvidas } from "@/components/Duvidas";
import { Final, Rodape } from "@/components/Final";
import { WhatsAppFlutuante } from "@/components/WhatsAppFlutuante";
import { Seo } from "@/components/Seo";

export default function Home() {
  useRolagemSuave();
  return (
    <>
      <Seo />
      <Header />
      <main>
        <Hero />
        <Usos />
        <Estrutura />
        <ComoReservar />
        <Duvidas />
        <Final />
      </main>
      <Rodape />
      <WhatsAppFlutuante />
    </>
  );
}
