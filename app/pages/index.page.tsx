import { SectionAbstract } from '@/components/sections/SectionAbstract';
import { SectionIntroduction } from '@/components/sections/SectionIntroduction';
import { SectionLanding } from '@/components/sections/SectionLanding';

export const IndexPage = (): JSX.Element => (
	<>
		<SectionLanding />
		<SectionAbstract />
		<SectionIntroduction />
	</>
);
