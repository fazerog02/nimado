import { ShepherdOptionsWithType, ShepherdTour, Tour } from 'react-shepherd'

import '../styles/shepherd.css'

interface Props {
	children: React.ReactNode
}

const Tutorial = (props: Props) => {
	const tourOptions: Tour.TourOptions = {
		defaultStepOptions: {
			cancelIcon: {
				enabled: true,
			},
		},
		useModalOverlay: false,
	}

	const steps: ShepherdOptionsWithType[] = [
		{
			id: 'welcome-intro',
			buttons: [
				{
					classes: 'shepherd-button-secondary',
					text: '閉じる',
					type: 'cancel',
                    action: () => {
                        if(document.getElementById("tutorial_ignore_checkbox").value) {
                            
                        }
                    }
				},
				{
					classes: 'shepherd-button-primary',
					text: '次へ',
					type: 'next',
				},
			],
			scrollTo: false,
			cancelIcon: {
				enabled: true,
			},
			title: 'nimadoへようこそ！',
			text: 'nimadoは「Twitchでの複数配信の同時視聴」を支援するサービスです。<br /><br />さっそく使ってみましょう！！<br /><br /><input id="tutorial_ignore_checkbox" type="checkbox" /><label for="tutorial_ignore_checkbox">今後表示しない</label>',
		},
		{
			id: 'menu-switch-intro',
			attachTo: { element: '#bottom_menu_switch', on: 'top' },
			buttons: [
				{
					classes: 'shepherd-button-secondary',
					text: 'Exit',
					type: 'cancel',
				},
				{
					classes: 'shepherd-button-primary',
					text: 'Back',
					type: 'back',
				},
				{
					classes: 'shepherd-button-primary',
					text: 'Next',
					type: 'next',
				},
			],
			scrollTo: false,
			cancelIcon: {
				enabled: true,
			},
			title: 'Welcome to React-Shepherd!',
			text: ['React-Shepherd is a JavaScript library for guiding users through your React app.'],
			when: {
				show: () => {
					console.log('show step')
				},
				hide: () => {
					console.log('hide step')
				},
			},
		},
	]

	return (
		<ShepherdTour steps={steps} tourOptions={tourOptions}>
			{props.children}
		</ShepherdTour>
	)
}

export default Tutorial
