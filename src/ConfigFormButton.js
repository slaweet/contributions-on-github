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
  config,
}) {
  const inputs = [{
    name: 'username',
    placeholder: 'E.g. LiskHQ',
    label: 'Username or Organization',
  }, {
    name: 'repo',
    placeholder: 'E.g. lisk-hub',
    label: 'Repository name',
  }, {
    name: 'since',
    label: 'From date',
    type: 'date',
  }, {
    name: 'until',
    label: 'Until date',
    type: 'date',
  }, {
    name: 'githubApi',
    placeholder: 'E.g. https://api.github.com',
    label: 'GitHub Enterprise API URL (optional)',
    optional: true,
  }];
  return (
    <UncontrolledButtonDropdown style={{ display: 'iniline-block' }}>
      <DropdownToggle caret size="sm">{`${config.username}/${config.repo}`}</DropdownToggle>
      <DropdownMenu right>
        <Form style={{ padding: 16, width: 300 }}>
          {inputs.map(({
            name, placeholder, label, type, optional,
          }) => (
            <FormGroup key={name}>
              <Label for={name}>{label}</Label>
              <Input
                defaultValue={config[name]}
                type={type}
                name={name}
                placeholder={placeholder}
                required={!optional}
              />
            </FormGroup>
          ))}
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
    gitgubApi: PropTypes.string,
  }).isRequired,
};

export default ConfigFormButton;
