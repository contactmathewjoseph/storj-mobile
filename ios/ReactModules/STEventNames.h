//
//  STEventNames.h
//  StorjMobile
//
//  Created by Bogdan Artemenko on 3/26/18.
//  Copyright © 2018 Storj. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface STEventNames : NSObject

@property (readonly, class) NSString *const EVENT_FILE_UPLOAD_START;
@property (readonly, class) NSString *const EVENT_FILE_UPLOAD_PROGRESS;
@property (readonly, class) NSString *const EVENT_FILE_UPLOAD_SUCCESSFULLY;
@property (readonly, class) NSString *const EVENT_FILE_UPLOAD_ERROR;

@property (readonly, class) NSString *const EVENT_FILE_DOWNLOAD_START;
@property (readonly, class) NSString *const EVENT_FILE_DOWNLOAD_PROGRESS;
@property (readonly, class) NSString *const EVENT_FILE_DOWNLOAD_SUCCESS;
@property (readonly, class) NSString *const EVENT_FILE_DOWNLOAD_ERROR;

@property (readonly, class) NSString *const EVENT_BUCKETS_UPDATED;
@property (readonly, class) NSString *const EVENT_FILES_UPDATED;
@property (readonly, class) NSString *const EVENT_BUCKET_CREATED;
@property (readonly, class) NSString *const EVENT_BUCKET_DELETED;
@property (readonly, class) NSString *const EVENT_FILE_DELETED;

@property (readonly, class) NSString *const EVENT_SYNC_STARTED;
@property (readonly, class) NSString *const EVENT_SYNC_ENTRY_UPDATED;

@property (readonly, class) NSArray *const availableEvents;

@end
