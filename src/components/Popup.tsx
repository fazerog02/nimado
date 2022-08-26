import { ReactNode } from 'react'

interface Props {
	is_open: boolean
	closePopup: Function
	title: string
	children?: ReactNode
}

const Popup = (props: Props) => {
	return (
		<div
			className={`flex h-screen w-screen items-center justify-center ${
				props.is_open ? '' : 'hidden'
			}`}
		>
			<div
				className='absolute inset-0 z-[100000] h-full w-full bg-black/50'
				onClick={() => props.closePopup()}
			></div>
			<div className='relative z-[100001] h-fit w-fit rounded-lg bg-white p-7'>
				<div className='mb-5 w-full border-b border-light_gray pb-2 text-xl'>{props.title}</div>
				{props.children}
			</div>
		</div>
	)
}

export default Popup
