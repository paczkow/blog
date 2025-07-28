import type { ReactNode } from "react";

type Props = {
    id: string;
    date: Date;
    title: string;
    topics: string[];
} & Variant;

export const Card = (props: Props) => {
    const { id, date, title, topics } = props;

    return (
        <a href={`/writing/${id}`} className="block no-underline">
            <article className="before:border-sand-3 before:bg-sand-2 dark:before:border-sand-5 dark:before:bg-sand-4 relative flex cursor-pointer gap-16 transition-opacity duration-300 ease-in-out group-hover:opacity-50 before:absolute before:left-[-1rem] before:right-[-1rem] before:top-[-2px] before:bottom-[-2px] before:-z-10 before:border before:opacity-20 before:border-opacity-30 before:transition-opacity before:duration-300 before:ease-in-out before:content-[''] group-hover:hover:opacity-100 hover:before:opacity-100 active:before:opacity-100 active:opacity-100 touch-action-manipulation md:hover:before:opacity-100 md:before:opacity-0 md:before:border-opacity-0 md:before:inset-[-2px] md:before:rounded-md ml-[-24px] md:rounded py-4 p-6">
                <time
                    className="hidden min-w-[80px] text-sm text-neutral-500 md:block"
                    dateTime={date.toISOString()}
                >
                    {date.toLocaleDateString()}
                </time>
                <div className="flex flex-col gap-4">
                    <h3 className="text-sand-12">
                        {title}
                    </h3>
                    {props.variant === "essay" ? (
                        <Essay
                            date={date}
                            readTime={props.readTime}
                            description={props.description}
                        />
                    ) : (
                        <Note status={props.status} />
                    )}
                    <div className="flex gap-4">
                        {topics.map((topic) => (
                            <span
                                key={topic}
                                className="text-sm text-neutral-500"
                            >
                                {topic}
                            </span>
                        ))}
                    </div>
                </div>
            </article>
        </a>
    );
};

type Variant =
    | {
          variant: "essay";
          readTime: number;
          description: string;
      }
    | {
          variant: "note";
          status: "spark" | "synthesize" | "evergreen";
      };

const Essay = ({
    date,
    readTime,
    description,
}: { date: Date; readTime: number; description: string }) => {
    return (
        <>
            <div className="text-sand-10 flex gap-2 text-sm md:flex">
                <time className="black md:hidden" dateTime={date.toISOString()}>
                    {date.toLocaleDateString()}
                </time>
                <span>{readTime} min read</span>
            </div>
            <div>
                <p className="text-sand-11">{description}</p>
            </div>
        </>
    );
};

const Note = ({ status }: { status: "spark" | "synthesize" | "evergreen" }) => {
    let content: { icon: null | ReactNode; label: null | string } = {
        icon: null,
        label: null,
    };

    switch (status) {
        case "spark":
            content = {
                icon: <SparkIcon />,
                label: "Spark",
            };
            break;
        case "synthesize":
            content = {
                icon: <ConnectIcon />,
                label: "Synthesize",
            };
            break;
        case "evergreen":
            content = {
                icon: <EvergreenIcon />,
                label: "Evergreen",
            };
    }

    return (
        <>
            <div className="text-sand-10 flex gap-2 text-sm md:flex items-center">
                <span>{content.icon}</span>
                <span>{content.label}</span>
            </div>
        </>
    );
};

const SparkIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-zap-icon lucide-zap h-4 w-4"
        role="img"
        aria-label="Spark icon"
    >
        <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
);

const ConnectIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Connect icon"
        className="lucide lucide-workflow-icon lucide-workflow h-4 w-4"
    >
        <rect width="8" height="8" x="3" y="3" rx="2" />
        <path d="M7 11v4a2 2 0 0 0 2 2h4" />
        <rect width="8" height="8" x="13" y="13" rx="2" />
    </svg>
);

const EvergreenIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label="Evergreen icon"
        className="lucide lucide-tree-pine-icon lucide-tree-pine w-4 h-4"
    >
        <path d="m17 14 3 3.3a1 1 0 0 1-.7 1.7H4.7a1 1 0 0 1-.7-1.7L7 14h-.3a1 1 0 0 1-.7-1.7L9 9h-.2A1 1 0 0 1 8 7.3L12 3l4 4.3a1 1 0 0 1-.8 1.7H15l3 3.3a1 1 0 0 1-.7 1.7H17Z" />
        <path d="M12 22v-3" />
    </svg>
);
