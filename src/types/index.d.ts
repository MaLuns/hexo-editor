declare interface Post {
	frontmatter: string;
	attributes: {
		[x: string]: any;
	};
	body: string;
	bodyBegin: number;
	_body: string;
	fileName: string;
	_handle: FileSystemFileHandle;
	_raw: string;
}

declare enum FileStoreTypeEnum {
	Local = 1,
	Github = 2,
	Gitee = 3,
}

declare interface FileStoreModel {
	id?: string;
	name: string;
	type: FileStoreTypeEnum;
	value: FileStoreModel.type extends "Local" ? FileSystemDirectoryHandle : string;
}
