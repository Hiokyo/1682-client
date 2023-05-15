import React, { useEffect, useMemo, useRef, useState } from "react";
import Filter from "./Filter";
import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  List,
  Spin,
  Statistic,
  Typography,
  message,
} from "antd";
import { format } from "date-fns";
import { DATE, SUCCESS } from "~/utils/constant";
import { MessageOutlined, EyeOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import styles from "./styles.module.scss";
import { setComment, viewBook } from "~/api/book";
import { useBookDetail } from "~/hooks/useBooks";
import { TextArea } from "~/components/atoms/Input";
import HTMLFlipBook from "react-pageflip";
import { addBookFavorite } from "~/api/user";
import InputNumber from "~/components/atoms/InputNumber";
import { useAppSelector } from "~/store";
const { Title } = Typography;
interface Props {
  bookId: any;
}

const BookDetails = (props: Props) => {
  const { bookId } = props;
  const { data, isFetching, isLoading, refetch } = useBookDetail({ bookId });
  const dataBook = data?.data;
  const [showComment, setShowComment] = useState(false);
  const [pageContent, setPageContent] = useState<any>();
  const [loadingBook, setLoadingBook] = useState(false);
  const [form] = Form.useForm();
  const [currentPage, setCurrentPage] = useState(0);
  const localPage = localStorage.getItem("currentPage");
  const bookRef = useRef<any>();
  const bookArea = useRef<any>(null);

  const userData = useAppSelector((state) => state.userInfo.userData);

  const handleShowComment = () => {
    setShowComment(!showComment);
    form.resetFields();
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      form.submit();
    }
  };

  const handleComment = async (formValues: any) => {
    const res = await setComment(bookId, formValues);
    if (res.message === SUCCESS) {
      message.success("Comment success");
      refetch();
      form.resetFields();
    } else {
      message.error(res.message);
    }
  };

  const htmlParser = (htmlString: string) => {
    let match;
    let lastIndex = 0;
    const parts: string[] = [];
    let charCount = 0;
    const regex = /<\/\w+>/g;
    while ((match = regex.exec(htmlString))) {
      const tagEndIndex = match.index + match[0].length;

      if (tagEndIndex - lastIndex > 20) {
        const part = htmlString.substring(lastIndex, match.index);
        parts.push(part);
        lastIndex = match.index;
        charCount = 0;
      } else {
        charCount = tagEndIndex - lastIndex;
      }
    }

    if (lastIndex < htmlString.length) {
      const part = htmlString.substring(lastIndex);
      parts.push(part);
    }
    return parts;
  };

  const handleGetContentpage = (chapterId: string) => {
    // setLoadingBook(true)
    const contentChapter = dataBook.chapters?.find(
      (item: any) => item._id === chapterId
    )?.content;
    const data = htmlParser(contentChapter);
    setPageContent(data);
  };

  // Api count view

  useEffect(() => {
    if (bookId) {
      viewBook(bookId);
    }
  }, [bookId]);

  useEffect(() => {
    if (localPage) {
      setCurrentPage(+localPage);
    }
  }, []);

  const handleAddFavorite = async () => {
    const res = await addBookFavorite(bookId);
    if (res.message === SUCCESS) {
      message.success("Add to favorite success");
    } else {
      message.error(res.message);
    }
  };

  const handleTurnPage = (value: any) => {
    bookRef?.current.pageFlip().flip(+value);
    setCurrentPage(value);
  };

  const handleNextPage = () => {
    bookRef?.current.pageFlip().flipNext();
  };

  const handlePrePage = () => {
    bookRef?.current.pageFlip().flipPrev();
  };

  const handleSaveCurrentPage = (value: any) => {
    setCurrentPage(value.data);
    localStorage.setItem("currentPage", value.data);
  };

  useEffect(() => {
    if (bookArea.current && pageContent) {
      setTimeout(function () {
        // document.getElementById('bookReader')?.scrollIntoView({ behavior: "smooth", inline: "center"});
        bookArea.current.scrollIntoView({ behavior: "smooth" });
        setLoadingBook(false);
      }, 500);
    }
  }, [pageContent]);

  return (
    <>
      <Spin spinning={isLoading || isFetching}>
        <Filter
          bookId={bookId}
          price={dataBook?.price || { amount: 0, currency: "" }}
          purchaser={dataBook?.purchaser || []}
        />
        <div className={styles.container}>
          <div className={styles.contentWrapper}>
            <div className={styles.infoContainer}>
              <div>
                <Card
                  className="mt-2"
                  headStyle={{ border: "none" }}
                  actions={[
                    <Statistic
                      value={dataBook?.commentsCount}
                      valueStyle={{ fontSize: "16px" }}
                      prefix={
                        <MessageOutlined onClick={() => handleShowComment()} />
                      }
                    />,
                  ]}
                  extra={
                    <div className={styles.extraGroup}>
                      { userData?.favorites?.find((item: any) => item.book._id === bookId) ?
                        <HeartFilled
                          style={{ marginRight: 10 }}
                        />
                        : 
                        <HeartOutlined
                          onClick={handleAddFavorite}
                          style={{ marginRight: 10 }}
                        />
                      }
                      <EyeOutlined /> {dataBook?.viewCount}
                    </div>
                  }
                >
                  <Meta
                    title={dataBook?.title}
                    description={
                      <div className={styles.userIdea}>
                        {dataBook?.updatedBy?.firstName}{" "}
                        {dataBook?.updatedBy?.lastName}
                        &nbsp;-&nbsp;
                        {dataBook
                          ? format(new Date(dataBook?.createdAt), DATE)
                          : "-"}
                      </div>
                    }
                  />
                  <List
                    className={styles.listChapter}
                    grid={{
                      gutter: 16,
                      xs: 1,
                      sm: 1,
                      md: 3,
                      lg: 3,
                      xl: 4,
                      xxl: 5,
                    }}
                    dataSource={dataBook?.chapters}
                    renderItem={(item: any) =>
                      (userData &&
                        userData?.subscriptionPlan &&
                        userData?.subscriptionPlan?.isSubscribed) ||
                      dataBook.purchaser?.find(
                        (item: any) => item?.user === userData?._id
                      ) ? (
                        <List.Item>
                          <Card
                            onClick={() => handleGetContentpage(item._id)}
                            hoverable
                            cover={
                              <img
                                alt="example"
                                src="https://picsum.photos/300/200"
                              />
                            }
                          >
                            <Title level={4}>{item.name}</Title>
                            <p>{format(new Date(item?.createdAt), DATE)}</p>
                          </Card>
                        </List.Item>
                      ) : (
                        <List.Item>
                          <Card
                            onClick={() =>
                              message.warning(
                                "Please subscribe to read this book"
                              )
                            }
                            hoverable
                            cover={
                              <img
                                alt="example"
                                src="https://picsum.photos/300/200"
                              />
                            }
                          >
                            <Title level={4}>{item.name}</Title>
                            <p>{format(new Date(item?.createdAt), DATE)}</p>
                          </Card>
                        </List.Item>
                      )
                    }
                  />
                </Card>

                {showComment && (
                  <div className={styles.commentContainer}>
                    {dataBook?.comments?.map((comment: any) => (
                      <Meta
                        key={comment._id}
                        className={styles.comment}
                        avatar={
                          <>
                            <Avatar
                              src={
                                comment?.createdBy?.avatar?.url ||
                                comment?.updatedBy?.avatar?.url
                              }
                            />{" "}
                            <strong>
                              {comment.createdBy?.firstName}{" "}
                              {comment.createdBy?.lastName}
                            </strong>
                          </>
                        }
                        description={
                          <p className={styles.commentContent}>
                            {comment.content}
                          </p>
                        }
                      />
                    ))}
                    <div className={styles.commentArea}>
                      <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleComment}
                      >
                        <Form.Item name="content">
                          <TextArea
                            className="mt-2"
                            placeholder="Enter your comment"
                            onKeyPress={(e: any) => handleKeyPress(e)}
                          />
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {pageContent ? (
            <Card
              loading={loadingBook}
              className={styles.bookContainer}
              id="bookReader"
              ref={bookArea}
              actions={[
                <div className={styles.pageNumber}>
                  <Button onClick={() => handlePrePage()}>Pre</Button>
                  <InputNumber
                    value={currentPage}
                    onPressEnter={(e: any) => handleTurnPage(e.target.value)}
                  />
                  <Button onClick={() => handleNextPage()}>Next</Button>
                </div>,
              ]}
            >
              <HTMLFlipBook
                ref={bookRef}
                width={300}
                height={400}
                className={styles.flipBook}
                style={{ margin: 0 }}
                startPage={localPage ? +localPage : 0}
                size={"fixed"}
                minWidth={200}
                maxWidth={300}
                minHeight={400}
                maxHeight={500}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={1}
                showCover={false}
                mobileScrollSupport={true}
                clickEventForward={false}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
                onFlip={(value: any) => handleSaveCurrentPage(value)}
              >
                <div className={styles.coverPage}>
                  <h2>{dataBook?.title}</h2>
                </div>
                {pageContent?.map((item: any, index: number) => (
                  <div
                    key={index}
                    className={styles.pageContent}
                    dangerouslySetInnerHTML={{ __html: item }}
                  ></div>
                ))}
                {/* <div 
                  dangerouslySetInnerHTML={{ __html: pageContent }}
                  className={styles.pageContent}>  
                </div> */}
                <div className={styles.coverPage}>
                  <h2>End chapter</h2>
                </div>
              </HTMLFlipBook>
            </Card>
          ) : null}
        </div>
      </Spin>
    </>
  );
};

export default BookDetails;
