import {
  Button,
  DropdownMenu,
  DropdownToggle,
  Form,
  FormGroup,
  Input,
  Label,
  UncontrolledButtonDropdown,
} from 'reactstrap';
import PropTypes from 'prop-types';
import React from 'react';

function ConfigFormButton({
  config: {
    username, repo, since, until,
  },
}) {
  return (
    <UncontrolledButtonDropdown>
      <DropdownToggle caret size="md">{`${username}/${repo}`}</DropdownToggle>
      <DropdownMenu right>
        <Form style={{ padding: 16, width: 300 }}>
          <FormGroup>
            <Label for="username">Username or Organization</Label>
            <Input defaultValue={username} name="username" placeholder="E.g. LiskHQ" required />
          </FormGroup>
          <FormGroup>
            <Label for="repo">Repository name</Label>
            <Input defaultValue={repo} name="repo" placeholder="E.g. lisk-hub" required />
          </FormGroup>
          <FormGroup>
            <Label for="since">From date</Label>
            <Input defaultValue={since} name="since" type="date" required />
          </FormGroup>
          <FormGroup>
            <Label for="until">Until date</Label>
            <Input defaultValue={until} name="until" type="date" required />
          </FormGroup>
          <Button color="primary" block>Update</Button>
        </Form>
      </DropdownMenu>
    </UncontrolledButtonDropdown>
  );
}

ConfigFormButton.propTypes = {
  config: PropTypes.shape({
    username: PropTypes.string.isRequired,
    repo: PropTypes.string.isRequired,
    since: PropTypes.string.isRequired,
    until: PropTypes.string.isRequired,
  }).isRequired,
};

export default ConfigFormButton;
