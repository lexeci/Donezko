import {AnimatedLink, Button, Task} from "@/components/ui";
import {HandPointing} from "@phosphor-icons/react/dist/ssr";

import styles from "./Banner.module.scss";

export default function Banner() {
    return (
        <div className={styles.banner}>
            <div className={styles.container}>
                <div className={styles.info}>
                    <div className={styles.topPanel}>
                        <AnimatedLink link="/about" title="About project"/>
                        <AnimatedLink link="/behind-code" title="Behind the code"/>
                        <AnimatedLink link="/faqs" title="FAQ's"/>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.title}>
                            <h1>
                                Are you ready ? <br/> Plan your day right now!
                            </h1>
                        </div>
                        <div className={styles.textBlock}>
                            <p>
                                Try our free task management platform. It provides Kanban boards
                                and task lists, catering to both structured and flexible
                                planning styles. Even more!
                            </p>
                        </div>
                        <Button type="link" link="/auth">
                            Go to Dashboard
                            <HandPointing
                                className={styles.hand}
                                size={22}
                                cursor={"pointer"}
                            />
                        </Button>
                    </div>
                </div>
                <div className={styles.background}>
                    <Task isBannerElem/>
                </div>
            </div>
        </div>
    );
}
