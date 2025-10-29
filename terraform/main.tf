resource "aws_security_group" "rbac_sg" {
  name        = "${var.project_name}-sg"
  description = "Allow HTTP(80), Backend(8000), SSH(22)"
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = [var.allow_cidr]
  }
  ingress { from_port = 80 to_port = 80 protocol = "tcp" cidr_blocks = [var.allow_cidr] }
  ingress { from_port = 8000 to_port = 8000 protocol = "tcp" cidr_blocks = [var.allow_cidr] }
  egress  { from_port = 0 to_port = 0 protocol = "-1" cidr_blocks = ["0.0.0.0/0"] }
}

data "aws_ami" "ubuntu" {
  most_recent = true
  owners      = ["099720109477"]
  filter { name="name" values=["ubuntu/images/hvm-ssd/ubuntu-noble-24.04-amd64-server-*"] }
  filter { name="virtualization-type" values=["hvm"] }
}

resource "aws_instance" "rbac_ec2" {
  ami                         = data.aws_ami.ubuntu.id
  instance_type               = "t3.micro"
  key_name                    = var.key_pair_name
  vpc_security_group_ids      = [aws_security_group.rbac_sg.id]
  tags = { Name = var.project_name }

  user_data = <<-EOF
    #!/bin/bash
    apt-get update -y
    apt-get install -y ca-certificates curl gnupg
    install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    chmod a+r /etc/apt/keyrings/docker.gpg
    echo       "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu       $(. /etc/os-release && echo "$VERSION_CODENAME") stable" |       tee /etc/apt/sources.list.d/docker.list > /dev/null
    apt-get update -y
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    usermod -aG docker ubuntu
  EOF
}

output "public_ip" {
  value = aws_instance.rbac_ec2.public_ip
}
