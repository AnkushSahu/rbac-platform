variable "aws_region" { type = string; default = "ap-south-1" }
variable "project_name" { type = string; default = "rbac-platform" }
variable "key_pair_name" { type = string }
variable "allow_cidr" { type = string; default = "0.0.0.0/0" }
