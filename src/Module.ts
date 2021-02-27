type Module = {
    name: string;
    data?: any;
    events?: ModuleEvents;
}

type ModuleEvents = {
    userJoined?: UserEvent;
    userLeft?: UserEvent;
    rolled?: RolledEvent;
    messageReceived?: MessageReceivedEvent;
    messageReceivedAny?: MessageReceivedEvent;
}

type UserEvent = (e: UserEventArgs) => void;
type RolledEvent = (e: RolledEventArgs) => void;
type MessageReceivedEvent = (e: MessageReceivedEventArgs) => void;

type UserEventArgs = { id: string; time: number; user: User; }
type RolledEventArgs = { id: string; time: number; from: User; to: User; }
type MessageReceivedEventArgs = { message: Message; }

type User = {
    device: "bot" | "tv" | "tablet" | "phone" | "desktup";
    icon: string;
    id: string;
    name: string;
    tripcode?: string;
    admin?: boolean;
};

type Message = {
    id: string;
    time: number;
    type: "message" | "me" | "roll" | "join" | "leave";
    message: string;

    user?: User;
    from?: User;
    to?: User;
};