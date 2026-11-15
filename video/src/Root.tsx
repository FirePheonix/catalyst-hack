import { Composition } from "remotion";
import { CatalystIntro } from "./CatalystIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CatalystIntro"
      component={CatalystIntro}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
