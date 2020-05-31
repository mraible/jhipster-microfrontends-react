import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction, byteSize, TextFormat } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './post.reducer';
import { IPost } from 'app/shared/model/blog/post.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IPostDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const PostDetail = (props: IPostDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { postEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="gatewayApp.blogPost.detail.title">Post</Translate> [<b>{postEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="title">
              <Translate contentKey="gatewayApp.blogPost.title">Title</Translate>
            </span>
          </dt>
          <dd>{postEntity.title}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="gatewayApp.blogPost.content">Content</Translate>
            </span>
          </dt>
          <dd>{postEntity.content}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="gatewayApp.blogPost.date">Date</Translate>
            </span>
          </dt>
          <dd>{postEntity.date ? <TextFormat value={postEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <Translate contentKey="gatewayApp.blogPost.blog">Blog</Translate>
          </dt>
          <dd>{postEntity.blog ? postEntity.blog.name : ''}</dd>
          <dt>
            <Translate contentKey="gatewayApp.blogPost.tag">Tag</Translate>
          </dt>
          <dd>
            {postEntity.tags
              ? postEntity.tags.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.name}</a>
                    {postEntity.tags && i === postEntity.tags.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/post" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/post/${postEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ post }: IRootState) => ({
  postEntity: post.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(PostDetail);
