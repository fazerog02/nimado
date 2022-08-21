import { ReactNode } from 'react'

interface Props {
	is_open: boolean
	closePopup: Function
	children?: ReactNode
}

const Popup = (props: Props) => {
	return (
		<div
			className={`w-screen h-screen flex items-center justify-center ${
				props.is_open ? '' : 'hidden'
			}`}
		>
			<div
				className='absolute inset-0 w-full h-full z-[100000] bg-black/50'
				onClick={() => props.closePopup()}
			></div>
			<div className='relative w-fit h-fit p-7 rounded-lg bg-white z-[100001]'>
				{props.children}
			</div>
		</div>
	)
}

export default Popup
