
export interface CreateCD {
    title: string,
    author: string,
    year: string,
    file: File | null,
    email: string
}

export interface Cd {
    id_album: number;
    title: string;
    author: string;
    year: string;
    image_link?: string | null;
}

export interface ModifyData {
    editingCD: number;
    email: string;
}

export interface WhichCdDelete {
    albumNumber: number;
}
