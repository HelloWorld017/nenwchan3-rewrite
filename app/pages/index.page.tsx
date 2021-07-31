import { SectionAboutMe } from '@/components/sections/SectionAboutMe';
import { SectionLanding } from '@/components/sections/SectionLanding';

export const IndexPage = (): JSX.Element => (
	<>
		<SectionLanding />
		<SectionAboutMe />
	</>
);
