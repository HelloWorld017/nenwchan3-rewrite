declare module '@simplei18n/core' {
  import type { TranslationDescriptor } from '@simplei18n/core'

  interface I18nConfig {
    locales: "en" | "ko";
    defaultLocale: "ko";
  }

  interface TranslationMap {
    abstract: {
      /** 저는 누군가의 기억에 남는 무언가를 만들고 싶습니다.<br/> 그렇기에 저는 사람의 마음에 닿는 디자인을 고민하고,<br/> 그것을 현실에서 구현하기 위한 엔지니어링을 하고 싶습니다.  */
      abstract: TranslationDescriptor<never, "br">;
      profile: {
        /** Aviate in Progress */
        bio: TranslationDescriptor<never, never>;
        /** 안녕하세요! 저는 소프트웨어 개발에 관심이 많은 김요한이라고 합니다.<br/> 저는 주로 <tag>nenw*</tag> 또는 <tag>Khinenw</tag> 라는 이름으로 활동하고 있습니다.  */
        description: TranslationDescriptor<never, "br" | "tag">;
      };
      quote: {
        /** 「울려라! 유포니엄」 작중 대사 */
        source: TranslationDescriptor<never, never>;
        /** 난 있지, 특별해지고 싶어. */
        text: TranslationDescriptor<never, never>;
      };
    };
    activities: {
      org: {
        /** if-Team, <Light>Organic</Light> */
        ifteam: TranslationDescriptor<never, "Light"> & {
          /** 청소년 개발팀 */
          description: TranslationDescriptor<never, never>;
        };
        /** RIDI */
        ridi: TranslationDescriptor<never, never> & {
          /** 리디 주식회사 */
          description: TranslationDescriptor<never, never>;
        };
        /** SPARCS */
        sparcs: TranslationDescriptor<never, never> & {
          /** 교내 서비스 개발 동아리 */
          description: TranslationDescriptor<never, never>;
        };
      };
      role: {
        /** 프론트엔드 엔지니어 */
        frontend_engineer: TranslationDescriptor<never, never>;
        /** 프론트엔드 리드 */
        frontend_lead: TranslationDescriptor<never, never>;
        /** 풀스택 엔지니어 */
        fullstack_engineer: TranslationDescriptor<never, never>;
        /** 팀장 */
        team_lead: TranslationDescriptor<never, never>;
      };
      team: {
        ridi: {
          /** 웹팀 */
          web: TranslationDescriptor<never, never>;
        };
        sparcs: {
          /** 카이스트 미러팀 */
          geoul: TranslationDescriptor<never, never>;
          /** 교내 커뮤니티 개발팀 */
          newara: TranslationDescriptor<never, never>;
          /** 서버 관리팀 */
          wheel: TranslationDescriptor<never, never>;
        };
      };
    };
    introduction: {
      developer: {
        /** 저는 개발에 관심과 열정이 많은 개발자입니다. <b>프론트엔드 / 백엔드 개발</b>부터 <b>게임 개발, 머신러닝, 데브옵스, 프로그래밍 언어</b> 등 정말 다양한 분야에 관심을 가지고 있습니다.  */
        description: TranslationDescriptor<never, "b">;
      };
      enthusiast: {
        /** 또한 저는 누군가에 기억에 남을 무언가를 만들기 위해서 <b>웹 디자인, 3D 모델링 및 아트, 인쇄물 디자인, 사운드 디자인</b> 등의 다양한 분야에 관심을 가지고 도전하고 있습니다.  */
        description: TranslationDescriptor<never, "b">;
      };
    };
    projects: {
      /** 개인적으로 진행했던 사이드 프로젝트들 중 보여드리고 싶은 프로젝트들입니다.<br /> 더 많은 프로젝트들을 보시고 싶으시다면 <Link>개인 깃허브</Link>에 방문해주시면 감사하겠습니다!  */
      description: TranslationDescriptor<never, "Link" | "br">;
    };
    sidebar: {
      blog: {
        /** 제가 알게된 것들을 정리해서 올리는 곳 */
        description: TranslationDescriptor<never, never>;
        /** Blog */
        title: TranslationDescriptor<never, never>;
      };
      /** 2026 Redesigned */
      description: TranslationDescriptor<never, never>;
      email: {
        /** 저에게 연락을 하실 수 있는 곳 */
        description: TranslationDescriptor<never, never>;
        /** Email */
        title: TranslationDescriptor<never, never>;
      };
      github: {
        /** 저의 프로젝트를 보실 수 있는 곳 */
        description: TranslationDescriptor<never, never>;
        /** GitHub */
        title: TranslationDescriptor<never, never>;
      };
      /** nenw.dev */
      header: TranslationDescriptor<never, never>;
      misskey: {
        /** 제가 랜덤한 말을 올리는 곳 */
        description: TranslationDescriptor<never, never>;
        /** Misskey */
        title: TranslationDescriptor<never, never>;
      };
    };
  }
}

declare global {
  module '*.i18n.yaml' {
    import type { Locale } from '@simplei18n/core';
    const locale: Locale;
    export default locale;
  }
}

export {}
