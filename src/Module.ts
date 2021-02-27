type Module = {
    name: string;
    data?: any;
}

type UserJoinedEvent = (e: UserJoinedEventArgs) => void;
type UserLeftEvent = (e: UserLeftEventArgs) => void;
type RolledEvent = (e: RolledEventArgs) => void;
type MessageReceivedEvent = (e: MessageReceivedEventArgs) => void;
type MessageReceivedAnyEvent = (e: MessageReceivedAnyEventArgs) => void;

type UserJoinedEventArgs = { id: string; time: number; user: User; }
type UserLeftEventArgs = { id: string; time: number; user: User; }
type RolledEventArgs = { id: string; time: number; from: User; to: User; }
type MessageReceivedEventArgs = { message: Message; }
type MessageReceivedAnyEventArgs = { message: Message; }

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