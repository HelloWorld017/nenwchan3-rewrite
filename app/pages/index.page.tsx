import { SectionAbstract } from '@/components/fragments/SectionAbstract';
import { SectionDetail } from '@/components/fragments/SectionDetail';
import { SectionIntroduction } from '@/components/fragments/SectionIntroduction';
import { SectionLanding } from '@/components/fragments/SectionLanding';
import { Sidebar } from '@/components/fragments/Sidebar';

export const IndexPage = (): JSX.Element => (
	<>
		<SectionLanding />
		<SectionAbstract />
		<SectionIntroduction />
		<SectionDetail />
		<Sidebar />
	</>
);
