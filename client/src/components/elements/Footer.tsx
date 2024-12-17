import Link from "next/link";
import type { PropsWithChildren } from "react";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export default function Footer({ children }: PropsWithChildren<unknown>) {
	return (
		<div className="pt-8 mx-auto bg-outerColor text-background">
			<div className="grid gap-12 row-gap-6 px-4 mb-8 md:px-8 sm:grid-cols-2 lg:grid-cols-4">
				<div className="sm:col-span-2">
					<Link href="/" className="logo">
						<strong className="capitalize flex-1 font-mono text-2xl tracking-widest">
							TPlanner.com
						</strong>
					</Link>
					<div className="mt-6 lg:max-w-sm ">
						<p>
							TPlanner is a free task management platform. It provides Kanban
							boards and task lists, catering to both structured and flexible
							planning styles.
						</p>
					</div>
				</div>
				<div className="text-sm">
					<div>
						<p className="text-base font-bold tracking-wide">Contact</p>
						<div className="flex flex-col gap-1 mt-2">
							<p className="mr-1">
								Email:{" "}
								<Link
									href="mailto:admin@tplanner.com"
									aria-label="email"
									title="Our email"
									className="text-primary-600 underline-anim dark"
								>
									admin@tplanner.com
								</Link>
							</p>
						</div>
					</div>
				</div>
				<div className="text-sm">
        <div>
                <p className="text-base font-bold tracking-wide dark:text-gray-200">Resources</p>
                <div className="flex flex-col items-start gap-1 mt-2">
                    <Link href="#" target="_blank" 									className="underline-anim dark"
                    >Github project page</Link>
                    <Link href="#" target="_blank" 									className="underline-anim dark"
                    >Project documentation</Link>
                </div>
            </div>
        </div>
			</div>
			<div className="flex flex-col-reverse justify-between gap-2 px-4 pt-4 pb-8 text-sm border-t border-t-background md:px-8 lg:flex-row">
				<p>© 2024 TPlanner. All Rights Reserved by Andriy Neaijko.</p>
				<div><p>Created with passion… and a few sleepless nights. {"☉ ‿ ⚆"}</p></div>
				<ul className="flex flex-col gap-2 mb-4 text-sm sm:flex-row md:mb-0">
					<li className="md:border-r-2 border-r-background md:pr-2">
						<Link className="underline-anim dark" href="#">FAQs</Link>
					</li>
					<li className="md:border-r-2 border-r-background md:pr-2">
						<Link className="underline-anim dark" href="#">Privacy Policy</Link>
					</li>
					<li className="md:border-r-2 border-r-background md:pr-2">
						<Link className="underline-anim dark" href="#">Terms of Service</Link>
					</li>
					<li className="md:border-r-2 border-r-background md:pr-2">
						<Link className="underline-anim dark" href="#">Contribution Guidelines</Link>
					</li>
					<li>
						<Link className="underline-anim dark" href="#">Legal</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
