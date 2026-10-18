'use client';

import { useEffect } from 'react';

export default function ConsoleArt() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    console.time('OneX');

    const logo = `
%c
   ██████╗ ███╗   ██╗███████╗██╗  ██╗
  ██╔═══██╗████╗  ██║██╔════╝╚██╗██╔╝
  ██║   ██║██╔██╗ ██║█████╗   ╚███╔╝
  ██║   ██║██║╚██╗██║██╔══╝   ██╔██╗
  ╚██████╔╝██║ ╚████║███████╗██╔╝ ██╗
   ╚═════╝ ╚═╝  ╚═══╝╚══════╝╚═╝  ╚═╝
    `;
    const tagline = '%cSpaceTechnologies — Member Portal';

    console.log(logo, 'color: #E2E8F0; font-weight: bold;');
    console.log(tagline, 'color: #94A3B8; font-size: 11px;');
    console.log('%cdesigned with focus', 'color: #64748B; font-size: 10px;');

    console.timeEnd('OneX');
  }, []);

  return null;
}
