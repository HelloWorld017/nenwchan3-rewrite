import {
  AudioWaveformIcon,
  BookTextIcon,
  CodeXmlIcon,
  GhostIcon,
  MailIcon,
  MoonStarIcon,
  ServerIcon,
  SnowflakeIcon,
} from 'lucide-react';
import type { ComponentType } from 'react';

const wrapLucideComponent = <TProps,>(LucideIcon: ComponentType<TProps>) => {
  const IconComponent = (props: TProps) => {
    const Icon = LucideIcon as ComponentType<{ width: string; height: string }>;
    return <Icon width='1em' height='1em' stroke='currentColor' {...props} />;
  };

  IconComponent.displayName = LucideIcon.displayName && `Icon${LucideIcon.displayName}`;

  return IconComponent;
};

export const IconAudioWaveform = wrapLucideComponent(AudioWaveformIcon);
export const IconBookText = wrapLucideComponent(BookTextIcon);
export const IconCodeXml = wrapLucideComponent(CodeXmlIcon);
export const IconGhost = wrapLucideComponent(GhostIcon);
export const IconMail = wrapLucideComponent(MailIcon);
export const IconMoonStar = wrapLucideComponent(MoonStarIcon);
export const IconServer = wrapLucideComponent(ServerIcon);
export const IconSnowflake = wrapLucideComponent(SnowflakeIcon);
