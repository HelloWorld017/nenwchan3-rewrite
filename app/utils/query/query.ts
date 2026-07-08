import { BackendHandler } from "../backend";

export const query = <T extends BackendHandler>(method: T['method'], path: T['path']) => {
};
