export interface Info {
    id: string;
    title: string;
    formats: (FormatsEntity)[];
    thumbnails?: (ThumbnailsEntity)[] | null;
    thumbnail: string;
    description: string;
    uploader: string;
    uploader_id: string;
    uploader_url: string;
    channel_id: string;
    channel_url: string;
    duration: number;
    view_count: number;
    average_rating?: null;
    age_limit: number;
    webpage_url: string;
    categories?: (string)[] | null;
    tags?: (null)[] | null;
    playable_in_embed: boolean;
    is_live: boolean;
    was_live: boolean;
    live_status: string;
    release_timestamp?: null;
    automatic_captions: AutomaticCaptions;
    subtitles: {
        [key: string]: Subtitle;
    };
    chapters?: null;
    like_count: number;
    channel: string;
    channel_follower_count: number;
    upload_date: string;
    availability: string;
    original_url: string;
    webpage_url_basename: string;
    webpage_url_domain: string;
    extractor: string;
    extractor_key: string;
    playlist?: null;
    playlist_index?: null;
    display_id: string;
    fulltitle: string;
    duration_string: string;
    requested_subtitles?: null;
    _has_drm?: null;
    asr: number;
    filesize?: null;
    format_id: string;
    format_note: string;
    source_preference: number;
    fps: number;
    height: number;
    quality: number;
    has_drm: boolean;
    tbr: number;
    url: string;
    width: number;
    language: string;
    language_preference: number;
    preference?: null;
    ext: string;
    vcodec: string;
    acodec: string;
    dynamic_range: string;
    protocol: string;
    video_ext: string;
    audio_ext: string;
    vbr: number;
    abr: number;
    format: string;
    resolution: string;
    filesize_approx: number;
    http_headers: {
        [key: string]: string
    };
    epoch: number;
    _filename: string;
    filename: string;
    urls: string;
    _type: string;
}

export interface FormatsEntity {
    format_id: string;
    format_note: string;
    ext: string;
    protocol: string;
    acodec: string;
    vcodec: string;
    url: string;
    width?: number | null;
    height?: number | null;
    fragments?: (FragmentsEntity)[] | null;
    audio_ext: string;
    video_ext: string;
    format: string;
    resolution: string;
    http_headers?: {
        [key: string]: string
    };
    asr?: number | null;
    filesize?: number | null;
    source_preference?: number | null;
    fps?: number | null;
    quality?: number | null;
    has_drm?: boolean | null;
    tbr?: number | null;
    language?: string | null;
    language_preference?: number | null;
    preference?: number | null;
    dynamic_range?: string | null;
    abr?: number | null;
    downloader_options?: DownloaderOptions | null;
    container?: string | null;
    vbr?: number | null;
    filesize_approx?: number | null;
}

export interface FragmentsEntity {
    url: string;
    duration: number;
}

export interface DownloaderOptions {
    http_chunk_size: number;
}

export interface ThumbnailsEntity {
    url: string;
    preference: number;
    id: string;
    height?: number | null;
    width?: number | null;
    resolution?: string | null;
}

export interface AutomaticCaptions {
    [key: string]: Subtitle[]
}

export interface Subtitle {
    ext: string;
    url: string;
    name: string;
}