import dotGreen from "~/assets/images/dotGreen.svg";
import dotOrange from "~/assets/images/dotOrange.svg";

export const DATE = "yyyy/MM/dd";
export const DATE_VI_FORMAT = "dd/MM/yyyy";
export const DATE_SIMPLE = "MM/dd";

export const SUCCESS = "Success";
export const KEY_MESSAGE = "message";
export const TITLE_ASC = "TITLE_ASC";
export const NAME_ASC = "NAME_ASC";

export const COMMON_PARAMS = {
  page: 1,
  limit: 10,
  sort: NAME_ASC,
};

export const PARAMS_GET_ALL = {
  page: 1,
  limit: 999,
  sort: TITLE_ASC,
};

export const PARAMS_GET_ALL_NAME = {
  page: 1,
  limit: 999,
  sort: NAME_ASC,
};

export const PARAMS_FILTER = {
  page: 1,
  limit: 999,
};

export enum SortBooks {
  "TITLE_DESC" = "Title",
  "CHAPTER_DESC" = "Chapter",
  "SUBSCRIBED_USER_DESC" = "Subscribed",
  "VIEW_ASC" = "View (Ascending)",
  "VIEW_DESC" = "View (Descending)",
  "LIKE_ASC" = "Like (Accending)",
  "LIKE_DESC" = "Like (Descending)",
  "DISLIKE_ASC" = "Dislike (Ascending)",
  "DISLIKE_DESC" = "Dislike (Descending)",
  "COMENT_ASC" = "Comment (Accending)",
  "COMENT_DESC" = "Comment (Descending)",
}

export enum SortReports {
  "TITLE_DESC" = "Title",
  "TITLE_ASC" = "Title (Ascending)",
  "DATE_CREATED_ASC" = "Date create (Accending)",
  "DATE_CREATED_DESC" = "Date create (Descending)",
  "STATUS_ASC" = "Status (Ascending)",
  "STATUS_DESC" = "Status (Descending)",
  "LIKE_ASC" = "Like (Accending)",
  "LIKE_DESC" = "Like (Descending)",
  "TYPE_ASC" = "Type (Descending)",
  "TYPE_DESC" = "Type (Descending)",
}

export enum SortTopic {
  "NAME_ASC" = "Name (Ascending)",
  "NAME_DESC" = "Name (Descending)",
  "DATE_CREATED_ASC" = "Date created (Ascending)",
  "DATE_CREATED_DESC" = "Date created (Descending)",
}

export enum SortPosts {
  "LIKE_ASC" = "Like (Accending)",
  "LIKE_DESC" = "Like (Descending)",
  "DISLIKE_ASC" = "Dislike (Ascending)",
  "DISLIKE_DESC" = "Dislike (Descending)",
  "VIEW_ASC" = "View (Ascending)",
  "VIEW_DESC" = "View (Descending)",
  "COMENT_ASC" = "Comment (Accending)",
  "COMENT_DESC" = "Comment (Descending)",
  "DATE_CREATED_ASC" = "Date created (Ascending)",
  "DATE_CREATED_DESC" = "Date created (Descending)",
}

export enum SortAccount {
  "EMAIL_ASC" = "Email (Ascending)",
  "EMAIL_DESC" = "Email (Descending)",
  "NAME_ASC" = "Name (Ascending)",
  "NAME_DESC" = "Name (Descending)",
  "DATE_CREATED_ASC" = "Date create (Accending)",
  "DATE_CREATED_DESC" = "Date create (Descending)",
}
export enum PaymentSort {
  AMOUNT_ASC = "Amount (Ascending)",
  AMOUNT_DESC = "Amount (Descending)",
  DATE_CREATED_DESC = "Date created (Descending)",
  DATE_CREATED_ASC = "Date created (Ascending)",
}

export enum UserStatus {
  "ACTIVE" = "Active",
  "INACTIVE" = "Inactive",
}

export enum Anonymous {
  "Anonymous" = "Anonymous",
  "Public" = "Public",
}

export enum Gender {
  "MALE" = "Male",
  "FEMALE" = "Female",
}

export enum Role {
  "ADMIN" = "Admin",
  "STAFF" = "Staff",
  "QUALITY_ASSURANCE_MANAGER" = "Quality assurance manager",
  "QUALITY_ASSURANCE_COORDINATOR" = "Quality assurance coordinator",
}

export enum Category {
  "ADMIN" = "Admin",
  "STAFF" = "Staff",
  "QUALITY_ASSURANCE_MANAGER" = "Quality assurance manager",
  "QUALITY_ASSURANCE_COORDINATOR" = "Quality assurance coordinator",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
export enum BookCurrency {
  VND = "VND",
  USD = "USD",
}

export enum PaymentType {
  'Book' = "BOOK",
  'Subscription' = "SUBSCRIPTION_PLAN",
}

export enum UserRole {
  Admin = "ADMIN",
  User = "USER",
  Author= "AUTHOR",
}

export const userIcon = {
  [-1]: "",
  [UserStatus.ACTIVE]: dotGreen,
  [UserStatus.INACTIVE]: dotOrange,
};

export interface Status {
  value: "ACTIVE" | "INACTIVE";
}

export const MAX_LENGTH = 255;

export const termAndCondition = `Welcome to our website! We're excited that you're interested in uploading files to our platform. Before you get started, please take a moment to review our terms and conditions for file uploads:

Ownership: By uploading files to our platform, you certify that you are the owner of the content, or have the necessary permissions to share the content.

Copyright: You agree not to upload any files that infringe on the copyright or intellectual property rights of others.

Prohibited Content: You agree not to upload any files that contain malware, viruses, or any other harmful content.

Responsibility: You are solely responsible for the content that you upload to our platform, and we assume no liability for any damage or loss resulting from your use of our services.

Confidentiality: We respect your privacy and will not share your uploaded files with any third parties without your express permission.

Compliance: You agree to comply with all applicable laws and regulations regarding the use of our platform and the upload of files.

Removal: We reserve the right to remove any uploaded files that violate our terms and conditions or are otherwise deemed inappropriate.

By uploading files to our platform, you agree to the above terms and conditions. If you have any questions or concerns, please contact us at [insert contact information].`;

export enum PAYMENT_STATUS {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
}
