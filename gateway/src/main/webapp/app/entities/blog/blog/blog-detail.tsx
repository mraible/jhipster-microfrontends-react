import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Button, Row, Col } from 'reactstrap';
import { Translate, ICrudGetAction } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IRootState } from 'app/shared/reducers';
import { getEntity } from './blog.reducer';
import { IBlog } from 'app/shared/model/blog/blog.model';
import { APP_DATE_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';

export interface IBlogDetailProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {}

export const BlogDetail = (props: IBlogDetailProps) => {
  useEffect(() => {
    props.getEntity(props.match.params.id);
  }, []);

  const { blogEntity } = props;
  return (
    <Row>
      <Col md="8">
        <h2>
          <Translate contentKey="gatewayApp.blogBlog.detail.title">Blog</Translate> [<b>{blogEntity.id}</b>]
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="name">
              <Translate contentKey="gatewayApp.blogBlog.name">Name</Translate>
            </span>
          </dt>
          <dd>{blogEntity.name}</dd>
          <dt>
            <span id="handle">
              <Translate contentKey="gatewayApp.blogBlog.handle">Handle</Translate>
            </span>
          </dt>
          <dd>{blogEntity.handle}</dd>
          <dt>
            <Translate contentKey="gatewayApp.blogBlog.user">User</Translate>
          </dt>
          <dd>{blogEntity.user ? blogEntity.user.login : ''}</dd>
        </dl>
        <Button tag={Link} to="/blog" replace color="info">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/blog/${blogEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

const mapStateToProps = ({ blog }: IRootState) => ({
  blogEntity: blog.entity,
});

const mapDispatchToProps = { getEntity };

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

export default connect(mapStateToProps, mapDispatchToProps)(BlogDetail);
