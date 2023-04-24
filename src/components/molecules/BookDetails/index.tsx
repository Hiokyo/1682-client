import React, { useEffect, useMemo, useRef, useState } from "react";
import Filter from "./Filter";
import {
  Avatar,
  Card,
  Form,
  List,
  Spin,
  Statistic,
  Typography,
  message,
} from "antd";
import { format } from "date-fns";
import { DATE, SUCCESS } from "~/utils/constant";
import { MessageOutlined, EyeOutlined, HeartOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import styles from "./styles.module.scss";
import { setComment, viewBook } from "~/api/book";
import { useBookDetail } from "~/hooks/useBooks";
import { TextArea } from "~/components/atoms/Input";
import HTMLFlipBook from "react-pageflip";
import { addBookFavorite } from "~/api/user";
const { Title } = Typography;
interface Props {
  bookId: any;
}

const BookDetails = (props: Props) => {
  const { bookId } = props;
  const { data, isFetching, isLoading, refetch } = useBookDetail({ bookId });
  const dataBook = data?.data;
  const [showComment, setShowComment] = useState(false);
  const [pageContent, setPageContent] = useState([]);
  const [loadingBook, setLoadingBook] = useState(false)
  const [form] = Form.useForm();

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

  const contentChapter = (chapterId: string) => {
    if (dataBook && chapterId) {
      return dataBook.chapters?.find((item: any) => item._id === chapterId)
        ?.content;
    }
  };

  const handleGetContentpage = (chapterId: string) => {
    setLoadingBook(true)
    const regex = /(\S+\s*){1,30}/g;
    const substrings = contentChapter(chapterId)?.match(regex);
    setPageContent(substrings);
    setTimeout(function() {
      document.getElementById('bookReader')?.scrollIntoView({ behavior: "smooth", inline: "center"});
      setLoadingBook(false);
    }, 1000);
  };
  // Api count view

  // useEffect(() => {
  //   if (bookId) {
  //     viewBook(bookId)
  //   }
  // }, [bookId])


  const handleAddFavorite = async () => {
    const res = await addBookFavorite(bookId);
    if (res.message === SUCCESS) {
      message.success('Add to favorite success')
    } else {
      message.error(res.message)
    }
  }

  return (
    <>
      <Spin spinning={isLoading || isFetching}>
        <Filter bookId={bookId}/>
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
                      <HeartOutlined 
                        onClick={handleAddFavorite}
                        style={{marginRight: 10}}
                      />
                      <EyeOutlined /> {dataBook?.viewCount}
                    </div>
                  }
                >
                  <Meta
                    avatar={
                      <Avatar
                        shape='square'
                        size={42}
                        src={"https://covers.openlibrary.org/b/id/240727-S.jpg"}
                      />
                    }
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
                    grid={{ gutter: 16, column: 5 }}
                    dataSource={dataBook?.chapters}
                    renderItem={(item: any) => (
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
                    )}
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
                            <Avatar src={comment?.createdBy?.avatar?.url || comment?.updatedBy?.avatar?.url} />{" "}
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
          { (pageContent.length > 0) ? 
            <Card
              loading={loadingBook}
              className={styles.bookContainer}
              id="bookReader"
            >
              <HTMLFlipBook
                width={300}
                height={500}
                className={styles.flipBook}
                style={{margin: 0}}
                startPage={0}
                size={"fixed"}
                minWidth={300}
                maxWidth={300}
                minHeight={500}
                maxHeight={500}
                drawShadow={true}
                flippingTime={1000}
                usePortrait={true}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={1}
                showCover={true}
                mobileScrollSupport={true}
                clickEventForward={false}
                useMouseEvents={true}
                swipeDistance={30}
                showPageCorners={true}
                disableFlipByClick={false}
              >
                <div
                  className={styles.coverPage}
                >
                  <h2>{dataBook?.title}</h2>
                </div>
                {
                  pageContent?.map((item: any, index: number ) => (
                    <div key={index} className={styles.pageContent}>{item}</div>
                  ))
                }
                <div
                  className={styles.coverPage}
                >
                  <h2>End chapter</h2>
                </div>
              </HTMLFlipBook>
            </Card>
            : null
          }
        </div>
      </Spin>
    </>
  );
};

export default BookDetails;
