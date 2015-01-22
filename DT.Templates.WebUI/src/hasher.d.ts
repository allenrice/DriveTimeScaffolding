
declare module Hasher {
    export interface HasherStatic {
        changed: any;
        init: any;
        initialized: any;
    }

}


declare var hasher: Hasher.HasherStatic;

declare module "hasher" {
    export = hasher;
}